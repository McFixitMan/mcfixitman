import { NextFunction, Request, Response } from 'express';

import { FailedResponse } from 'mcfixitman.shared/types/responses';
import { ParamsDictionary } from 'express-serve-static-core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ControllerAction<SuccessfulResponse = void, RequestBody = any> = (req: Request<ParamsDictionary, any, RequestBody>, res: Response<(SuccessfulResponse & { isError?: false }) | FailedResponse>, next: NextFunction) => Promise<void | Response<(SuccessfulResponse & { isError?: false }) | FailedResponse>>;