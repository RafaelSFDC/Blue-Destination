import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes CSS com suporte para condicionais e merge de classes Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um valor numérico como moeda (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Calcula o preço com desconto
 */
export function calculateDiscountedPrice(
  price: number,
  discount?: number
): number {
  if (!discount) return price;
  return price * (1 - discount / 100);
}

/**
 * Formata uma data no formato DD/MM/YYYY
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

/**
 * Formata uma data usando o date-fns
 */
export function formatDateFns(
  dateString: string,
  formatStr: string = "dd/MM/yyyy"
): string {
  try {
    const date = new Date(dateString);
    const { format } = require("date-fns");
    const { ptBR } = require("date-fns/locale");
    return format(date, formatStr, { locale: ptBR });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

/**
 * Trunca um texto para um número máximo de caracteres
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Gera um objeto representando estrelas para avaliações
 * @param rating - Avaliação de 0 a 5
 * @returns Objeto com quantidade de estrelas cheias, meia estrela e vazias
 */
export function generateStars(rating: number): {
  filled: number;
  half: boolean;
  empty: number;
} {
  const filled = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - filled - (half ? 1 : 0);

  return { filled, half, empty };
}

/**
 * Gera um ID único
 */
export function generateId(prefix = ""): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Calcula a duração entre duas datas em dias
 */
export function calculateDurationInDays(
  startDate: string,
  endDate: string
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Verifica se um objeto está vazio
 */
export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}
