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
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>
      <Button className="w-full" type="submit">
        Sign in with e-mail
      </Button>

      <Button className="w-full" variant="link" size="sm">
        <Link href="/auth/sign-up">Create new account</Link>
      </Button>

      <Separator />

      <Button className="w-full" variant="outline" type="submit">
        <Image src={githubIcon} className="mr-2 size-4 dark:invert" alt="" />
        Sign in with github
      </Button>
    </form>
  )
}
