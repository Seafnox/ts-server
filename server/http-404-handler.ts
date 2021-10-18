import { Catch, ExceptionFilterMethods, PlatformContext, ResourceNotFound } from '@tsed/common';

@Catch(ResourceNotFound)
export class Http404Filter implements ExceptionFilterMethods {
    public async catch(exception: ResourceNotFound, ctx: PlatformContext): Promise<void> {
        const { response }: PlatformContext = ctx;

        const obj = {
            status: exception.status,
            message: exception.message,
            url: exception.url,
        };
        // Json response
        response
            .status(exception.status)
            .body(obj);

        // // Or with ejs/handlers/etc...
        // const html = await response.render('404.ejs', obj);
        // response
        //     .status(exception.status)
        //     .body(html);
    }
}
