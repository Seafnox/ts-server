import { JsonProperty, Required } from '@tsed/common';

export class CalendarDto {
    @JsonProperty()
    @Required()
    public id: string;

    @JsonProperty()
    @Required()
    public name: string;
}
