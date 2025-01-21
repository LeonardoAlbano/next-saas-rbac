import { defineAbility } from '@saas/auth'

const ability = defineAbility({ role: 'ADMIN'})

const userCanInviteSomeoneElse = ability.can('invite', 'User')
const userCanDeleteOtherUsers = ability.can('delete', 'User')

const userCannotDeleteOtherUsers = ability.cannot('delete', 'User')

