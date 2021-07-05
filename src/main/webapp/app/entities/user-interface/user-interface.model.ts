export interface IUserInterface {
  id?: number;
  iDUserInterface?: number;
  themeName?: string | null;
  color?: string | null;
}

export class UserInterface implements IUserInterface {
  constructor(public id?: number, public iDUserInterface?: number, public themeName?: string | null, public color?: string | null) {}
}

export function getUserInterfaceIdentifier(userInterface: IUserInterface): number | undefined {
  return userInterface.id;
}
