
import { BaseSchema } from '../../common/dto/base.dto';

export interface UserDTO extends BaseSchema {
  name: string; 
  email: string; 
  password: string; 
  accessToken?: string | null; 
  refreshToken?: string | null; 
  groups: string[];
}
