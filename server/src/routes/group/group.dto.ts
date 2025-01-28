import { BaseSchema } from "../../common/dto/base.dto";

export interface GroupDTO extends BaseSchema {
    name: string; // Group's name
    description?: string; // Optional description of the group
    members: string[]; // List of User IDs (as strings)
    createdBy: string; // ID of the user who created the group
    inviteLink?:string;
  }
  