import { ValidationOptions, registerDecorator } from 'class-validator';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,64}$/;

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          return typeof value === 'string' && PWD_REGEX.test(value); // You can return a Promise<boolean> here as well, if you want to make async validation
        },
        defaultMessage(args): string {
          return `${args.property} must be a valid password. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%). It must also be 8-64 characters long.`;
        },
      },
    });
  };
}
