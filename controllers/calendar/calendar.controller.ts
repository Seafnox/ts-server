import { Authenticated, BodyParams, Controller, Delete, Get, PathParams, Post, Required } from '@tsed/common';
import { CalendarDto } from './calentar.dto';

@Controller('/calendars')
export class CalendarController {

    @Get('/')
    public async getCalendars(): Promise<CalendarDto[]> {
        return [{ id: '1', name: 'test' }];
    }

    @Get('/:id')
    public async getCalendar(@Required() @PathParams('id') id: string): Promise<CalendarDto> {
        return { id, name: 'test' };
    }

    @Post('/')
    @Authenticated()
    public async post(
        @Required() @BodyParams('calendar') calendar: CalendarDto,
    ): Promise<CalendarDto> {
        calendar.id = '1';

        return Promise.resolve(calendar);
    }

    @Delete('/')
    @Authenticated()
    public async deleteItem(
        @Required() @BodyParams('id') id: string,
    ): Promise<CalendarDto> {
        return { id, name: 'calendar' };
    }
}
