'use client'

import { MessagesContext } from '@/context/MessagesContext'
import { api } from '@/convex/_generated/api'
import Lookup from '@/data/Lookup'
import Prompt from '@/data/Prompt'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from '@codesandbox/sandpack-react'
import axios from 'axios'
import { useConvex, useMutation } from 'convex/react'
import { Loader } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { countToken } from './ChatView'
import { UserDetailContext } from '@/context/UserDetailContext'
const CodeView = () => {
  const { id } = useParams()
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  const [activeTab, setActiveTab] = useState('code')
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE)
  const { messages, setMessages } = useContext(MessagesContext)
  const UpdateFiles = useMutation(api.workspace.UpdateFiles)
  const convex = useConvex()
  const [loading, setLoading] = useState(false)
  const UpdateTokens = useMutation(api.users.UpdateToken)



  useEffect(() => {
    id && GetFiles()
  }, [id])

  const GetFiles = async () => {
    setLoading(true)
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    })
    const mergeFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData }
    setFiles(mergeFiles)
    setLoading(false)
  }

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1]?.role
      if (role == 'user') {
        GenerateAiCode()
      }
    }
  }, [messages])

  const GenerateAiCode = async () => {
    setLoading(true)
    const PROMPT = JSON.stringify(messages) + ' ' + Prompt.CODE_GEN_PROMPT
    const result = await axios.post('/api/gen-ai-code', {
      prompt: PROMPT,
    })
    console.log(result.data)
    const aiResp = result.data

    const mergeFiles = { ...Lookup.DEFAULT_FILE, ...aiResp.files }
    setFiles(mergeFiles)
    await UpdateFiles({
      workspaceId: id,
      files: aiResp?.files,
    })

    const token =Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)))
        // Update token to database
        await UpdateTokens({
          userId: userDetail?._id,
          token: token,
        })
        setUserDetail(prev => ({
          ...prev,
          token: token
        }))
    setActiveTab('code') // can be changed warning
    setLoading(false)
  }
  return (
    <div className='relative'>
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center flex-wrap shrink-0 justify-center bg-black p-1 w-[140px] gap-3 rounded-full">
          <h2
            className={`text-sm cursor-pointer ${activeTab == 'code' && 'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}
            onClick={() => setActiveTab('code')}>
            Code
          </h2>
          <h2
            className={`text-sm cursor-pointer ${activeTab == 'preview' && 'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}
            onClick={() => setActiveTab('preview')}>
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        template="react"
        theme={'dark'}
        files={files}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
          },
        }}
        options={{
          externalResources: ['https://cdn.tailwindcss.com'],
        }}>
        <SandpackLayout>
          {activeTab == 'code' ? (
            <>
              <SandpackFileExplorer style={{ height: '80vh' }} />
              <SandpackCodeEditor style={{ height: '80vh' }} />
            </>
          ) : (
            <>
              <SandpackPreview style={{ height: '80vh' }} showNavigator />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
      { loading && <div className="p-10 bg-gray-900 opacity-75 absolute top-0 rounded-lg w-full h-full items-center justify-center flex">
        <Loader className="animate-spin h-10 w-10 text-white" />
        <h2 className="text-white">Generating your files...</h2>
      </div>}
    </div>
  )
}

export default CodeView
