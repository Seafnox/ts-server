import {Authenticated, BodyParams, Controller, Delete, Get, Post, QueryParams, Required} from "@tsed/common";
import {CalendarDto} from "./calentar.dto";

@Controller("/calendars")
export class CalendarController {

    @Get("/")
    async renderCalendars(): Promise<Array<CalendarDto>> {
        return [{id: '1', name: "test"}];
    }

    @Post("/")
    @Authenticated()
    async post(
        @Required() @QueryParams("calendar") calendar: CalendarDto
    ): Promise<CalendarDto> {
        calendar.id = "1";

        return Promise.resolve(calendar);
    }

    @Delete("/")
    @Authenticated()
    async deleteItem(
        @BodyParams("calendar.id") @Required() id: string
    ): Promise<CalendarDto> {
        return {id, name: "calendar"};
    }
}
