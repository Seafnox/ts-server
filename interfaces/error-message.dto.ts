export interface ErrorMessageDto {
    name: string;
    message: string;
    status: number;
    errors: Error[];
}
