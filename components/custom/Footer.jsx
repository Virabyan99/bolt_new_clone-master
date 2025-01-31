import { HelpingHand, LogOutIcon, Settings, Wallet2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

const Footer = () => {
  const router = useRouter()
  const options = [
    {
      name: 'Settings',
      icon: <Settings />,
    },
    {
      name: 'Help Center',
      icon: <HelpingHand />,
    },
    {
      name: 'My Subscription',
      icon: <Wallet2 />,
      path: '/pricing',
    },
    {
      name: 'Sign Out',
      icon: <LogOutIcon />,
    },
  ]

  const onOptionClick = (option) => {
    router.push(option.path)
  }
  return (
    <div className="p-2 mb-10">
      {options.map((option, index) => (
        <Button
          variant="ghost"
          className="w-full flex justify-start my-3"
          key={index}
          onClick={() => onOptionClick(option)}>
          {option.icon}
          {option.name}
        </Button>
      ))}
    </div>
  )
}

export default Footer
