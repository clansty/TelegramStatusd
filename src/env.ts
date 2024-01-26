import z from 'zod';

const configParsed = z.object({
  TG_API_ID: z.string().regex(/^\d+$/).transform(Number),
  TG_API_HASH: z.string(),
  TG_SESSION: z.string().optional(),
}).safeParse(process.env);

if (!configParsed.success) {
  console.error('环境变量解析错误:', (configParsed as any).error);
  process.exit(1);
}

export default configParsed.data;
