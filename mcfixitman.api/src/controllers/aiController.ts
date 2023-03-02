import { ControllerAction } from 'src/types/controllerAction';
import { HttpStatusCode } from 'mcfixitman.shared/constants/httpStatusCode';

class AiController {
    createCompletion: ControllerAction<{ response: string }, { prompt: string }> = async (req, res, next) => {
        const prompt = req.body.prompt;

        try {
            const responseString = await req.aiUtility?.createCompletion(prompt);

            return res
                .status(HttpStatusCode.OK)
                .send({ response: responseString ?? '' });
        } catch (err) {
            return next(err);
        }
    };

    createImageUri: ControllerAction<{ response: string }, { prompt: string }> = async (req, res, next) => {
        const prompt = req.body.prompt;

        try {
            const responseUri = await req.aiUtility?.createImageUri(prompt);

            return res
                .status(HttpStatusCode.OK)
                .send({ response: responseUri ?? '' });
        } catch (err) {
            return next(err);
        }
    };
}

const aiController = new AiController();

export { aiController };    