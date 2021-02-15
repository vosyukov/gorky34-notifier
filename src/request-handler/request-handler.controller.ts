import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RequestHandlerService } from './request-handler.service';
import { StatusCheckerService } from '../status-cheker/status-checker.service';

@Controller('request')
export class RequestHandlerController {
  constructor(
    private readonly requestHandlerService: RequestHandlerService,
    private readonly statusCheckerService: StatusCheckerService,
  ) {}

  @Post('handler')
  @HttpCode(200)
  public async handler(@Body() body) {
    console.log(body);

    const { type = null, object = null } = body;

    if (type === 'confirmation') {
      return '974b8923';
    } else if (type === 'lead_forms_new') {
      const { user_id, answers } = object;
      await this.requestHandlerService.create(
        user_id,
        answers[0].answer,
        answers[1].answer,
        answers[2].answer,
        answers[3].answer,
      );
    }

    // this.statusCheckerService.get();
  }
}
