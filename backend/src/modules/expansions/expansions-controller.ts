import { Request, Response } from "express";
import { expansions } from "../../db/schema";
import { AuthorizationError } from "../../errors/authorization-error";
import { CreateExpansionService } from "./services/create-expansion-service";
import { DeleteExpansionService } from "./services/delete-expansion-service";
import { GetExpansionService } from "./services/get-expansion-service";
import { GetManyExpansionsService } from "./services/get-many-expansions-service";
import { UpdateExpansionService } from "./services/update-expansion-service";

type Expansion = typeof expansions.$inferSelect;

export class ExpansionsController {
  create = async (req: Request, res: Response) => {
    const { userPermissions } = req;
    if (!userPermissions || !userPermissions.includes("expansions:create"))
      throw new AuthorizationError();
    const id = await new CreateExpansionService().execute(req.body);
    res.json({ success: true, message: "Expansion created.", data: id });
  };

  get = async (req: Request, res: Response) => {
    const { id } = req.query;
    let data: Expansion | Expansion[] | null = null;

    data = id
      ? await new GetExpansionService().execute(id)
      : await new GetManyExpansionsService().execute(req.query);

    res.json({ success: true, data });
  };

  update = async (req: Request, res: Response) => {
    const { userPermissions } = req;
    if (!userPermissions || !userPermissions.includes("expansions:update"))
      throw new AuthorizationError();
    await new UpdateExpansionService().execute(req.body);
    res.json({ success: true, message: "Expansion updated." });
  };

  delete = async (req: Request, res: Response) => {
    const { userPermissions } = req;
    if (!userPermissions || !userPermissions.includes("expansions:delete"))
      throw new AuthorizationError();
    await new DeleteExpansionService().execute(req.query.id);
    res.json({ success: true, message: "Expansion deleted." });
  };
}
