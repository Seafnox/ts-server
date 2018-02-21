export interface ErrorResponseInterface {
    message: string;
    description: string;
    fieldErrors: any; // TODO уточнить у бэка структуру ошибок
    params: any; // TODO уточнить у бэка структуру ошибок
}
