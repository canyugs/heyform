import { Auth, FormGuard, Team } from '@decorator'
import { FormDetailInput, FormType } from '@graphql'
import { date } from '@heyform-inc/utils'
import { FormModel, TeamModel } from '@model'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { FormService, SubmissionService } from '@service'

@Resolver()
@Auth()
export class FormDetailResolver {
  constructor(
    private readonly formService: FormService,
    private readonly submissionService: SubmissionService
  ) { }

  @Query(returns => FormType)
  @FormGuard()
  async formDetail(
    @Team() team: TeamModel,
    @Args('input') input: FormDetailInput
  ): Promise<FormModel> {
    const [form, submissionCount] = await Promise.all([
      this.formService.findById(input.formId),
      this.submissionService.count({ formId: input.formId })
    ])

    //@ts-ignore
    form.updatedAt = date(form.get('updatedAt')).unix()

    //@ts-ignore
    form.submissionCount = submissionCount

    return form
  }


}
