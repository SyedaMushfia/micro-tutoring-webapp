export interface NavLinkType {
  name: string;
  link: string;
}

export interface InputField {
  nameOfInput: string;
  id: string;
  type: string;
  minLength?: number;
  pattern?: string;
  ariaLabel: string;
}
