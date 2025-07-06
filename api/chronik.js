{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Datei: /api/chronik.js\
\
import \{ createClient \} from '@supabase/supabase-js';\
\
const supabaseUrl = process.env.SUPABASE_URL;\
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;\
\
const supabase = createClient(supabaseUrl, supabaseKey);\
\
export default async function handler(req, res) \{\
  if (req.method === 'GET') \{\
    const \{ data, error \} = await supabase\
      .from('chronik_entries')\
      .select('*')\
      .order('id', \{ ascending: true \});\
\
    if (error) return res.status(500).json(\{ error: error.message \});\
    return res.status(200).json(data);\
  \}\
\
  if (req.method === 'POST') \{\
    const \{ note, flow, date \} = req.body;\
    if (!note || !date)\
      return res.status(400).json(\{ error: 'note und date erforderlich' \});\
\
    const \{ error \} = await supabase\
      .from('chronik_entries')\
      .insert([\{ note, flow, date \}]);\
\
    if (error) return res.status(500).json(\{ error: error.message \});\
    return res.status(200).json(\{ success: true \});\
  \}\
\
  return res.status(405).json(\{ error: 'Nur GET und POST erlaubt' \});\
\}}