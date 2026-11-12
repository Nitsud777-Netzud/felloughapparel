export type WhopPrice = {
  amount?: string | number | null;
  currency?: string | null;
  display_decimals?: number | null;
};

export type WhopVariant = {
  id?: string;
  title?: string | null;
  visibility?: string | null;
  billing_type?: string | null;
  initial_price?: WhopPrice | number | string | null;
  renewal_price?: WhopPrice | number | string | null;
  unlimited_stock?: boolean | null;
  stock?: number | null;
};

export type WhopProduct = {
  id: string;
  title: string;
  description?: string | null;
  headline?: string | null;
  visibility?: string | null;
  route?: string | null;
  logo_url?: string | null;
  gallery_images?: Array<{ url?: string | null; content_type?: string | null }>;
  default_variant?: WhopVariant | null;
  variants?: WhopVariant[] | null;
  variant_attributes?: Record<string, string[]> | null;
  metadata?: Record<string, unknown> | null;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  images: string[];
  price: number | null;
  currency: string;
  planId: string | null;
  variants: WhopVariant[];
  attributes: Record<string, string[]>;
  madeInUsaVerified: boolean;
  slug: string;
};