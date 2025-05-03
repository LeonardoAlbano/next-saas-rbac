import Image from 'next/image'
import Link from 'next/link'

import githubIcon from '@/app/assets/github-icon.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function SignInPage() {
  return (
    <form action="" className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="name">Nome</Label>
        <Input name="name" type="name" id="name" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password_confirmation">Confirm your passwords</Label>
        <Input
          name="password_confirmation"
          type="password"
          id="password_confirmation"
        />
      </div>

      <Button className="w-full cursor-pointer" type="submit">
        Create account
      </Button>

      <Button variant="link" className="w-full cursor-pointer" asChild>
        <Link href="/auth/sign-in">Already registered? Sign in</Link>
      </Button>

      <Separator />

      <Button className="w-full cursor-pointer" variant="outline" type="submit">
        <Image src={githubIcon} className="mr-2 size-4 dark:invert" alt="" />
        Sign up with Github
      </Button>
    </form>
  )
}
