import * as bcrypt from 'bcrypt';
import { cpf } from 'cpf-cnpj-validator';
import { isAlpha, isNumeric } from 'validator';
import { Buffer } from 'buffer';

function validateDocument(
  document: string,
  is_brasileiro: boolean = true,
): boolean {
  const isValidDocument = is_brasileiro
    ? cpf.isValid(document)
    : validateDocumentRNE(document);
  return isValidDocument;
}

function validateDocumentRNE(document: string): boolean {
  const rneFormated = document.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
  if (rneFormated.length !== 7) {
    return false;
  }

  const firstTwo = rneFormated.substring(0, 1);
  const lastSix = rneFormated.substring(1);

  return isAlpha(firstTwo) && isNumeric(lastSix, { no_symbols: true });
}

async function encrypitPassword(password: string): Promise<string> {
  const salt = 10;
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
}

function encodeBase64(data: string): string {
  return Buffer.from(data).toString('base64');
}

export {
  encrypitPassword,
  validateDocument,
  validateDocumentRNE,
  encodeBase64,
};
