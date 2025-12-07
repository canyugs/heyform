import { Auth, User } from '@decorator'
import { VERIFY_USER_EMAIL } from '@environments'
import { UserDetailType } from '@graphql'
import { helper } from '@heyform-inc/utils'
import { UserModel } from '@model'
import { Query, Resolver } from '@nestjs/graphql'
import { SocialLoginService } from '@service'

const { isValid } = helper

@Resolver()
@Auth()
export class UserDetailResolver {
  constructor(private readonly socialLoginService: SocialLoginService) {}

  @Query(returns => UserDetailType)
  async userDetail(@User() user: UserModel): Promise<UserDetailType> {
    const result = await this.socialLoginService.findByUserId(user.id)

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      lang: user.lang,
      // If VERIFY_USER_EMAIL is disabled, always return true
      isEmailVerified: VERIFY_USER_EMAIL ? user.isEmailVerified : true,
      isSocialAccount: isValid(result),
      isDeletionScheduled: user.isDeletionScheduled,
      deletionScheduledAt: user.deletionScheduledAt
    }
  }
}
