import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const CreateWorkspace = mutation({
  args: {
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
      })
    ),
    user: v.id('users'),
  },
  handler: async (ctx, args) => {
    const workspaceId = await ctx.db.insert('workspaces', {
      messages: args.messages,
      user: args.user,
    })
    return workspaceId
  },
})

export const GetWorkspace = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.workspaceId)
    return result
  },
})

export const UpdateMessages = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.workspaceId, {
      messages: args.messages,
    })
    return result
  },
})
export const UpdateFiles = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    files: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.workspaceId, {
      fileData: args.files,
    })
    return result
  },
})
