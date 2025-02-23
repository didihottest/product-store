export class AuthResponseDTO {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}
