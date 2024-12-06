import { setupServer } from "msw/node";
import { disciplineHandlers } from "./handlers/disciplineHandlers";
import { resultHandlers } from "./handlers/resultHandlers";
import { participantHandlers } from "./handlers/participantHandlers";

export const server = setupServer(
    ...disciplineHandlers,
    ...resultHandlers,
    ...participantHandlers
);