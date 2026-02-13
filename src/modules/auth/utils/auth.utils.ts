import * as bcrypt from 'bcrypt';
import { cpf } from 'cpf-cnpj-validator';
import { isAlpha, isNumeric } from 'validator';
import { Buffer } from 'buffer';

function validarDocumento(
  documento: string,
  brasileiro: boolean = true,
): boolean {
  const documentoValido = brasileiro
    ? cpf.isValid(documento)
    : validarDocumentoRNE(documento);
  return documentoValido;
}

function validarDocumentoRNE(documento: string): boolean {
  const rneFormatado = documento.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
  if (rneFormatado.length !== 7) {
    return false;
  }

  const primeiroCaractere = rneFormatado.substring(0, 1);
  const ultimosSeis = rneFormatado.substring(1);

  return (
    isAlpha(primeiroCaractere) && isNumeric(ultimosSeis, { no_symbols: true })
  );
}

async function gerarHashSenha(senha: string): Promise<string> {
  const sal = 10;
  const senhaComHash = await bcrypt.hash(senha, sal);
  return senhaComHash;
}

async function compararSenha(
  senha: string,
  senhaComHash: string,
): Promise<boolean> {
  return bcrypt.compare(senha, senhaComHash);
}

function decodificarBase64(dadoCodificado: string): string {
  return Buffer.from(dadoCodificado, 'base64').toString('utf-8');
}

export {
  gerarHashSenha,
  compararSenha,
  validarDocumento,
  validarDocumentoRNE,
  decodificarBase64,
};
