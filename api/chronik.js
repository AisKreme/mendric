{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;}
{\colortbl;\red255\green255\blue255;\red155\green162\blue177;\red136\green185\blue102;}
{\*\expandedcolortbl;;\cssrgb\c67059\c69804\c74902;\cssrgb\c59608\c76471\c47451;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Datei: /api/chronik.js\
\
import \{ createClient \} from '@supabase/supabase-js';\
\
const supabaseUrl = process.env.SUPABASE_URL;\
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;\
\pard\tx560\tx1120\tx1680\tx2240\tx2800\tx3360\tx3920\tx4480\tx5040\tx5600\tx6160\tx6720\pardirnatural\partightenfactor0

\f1\fs26 \cf2 console.log(\cf3 '\uc0\u55357 \u56589  Supabase URL:'\cf2 , process.env.SUPABASE_URL);\
console.log(\cf3 '\uc0\u55357 \u56589  Supabase KEY:'\cf2 , process.env.SUPABASE_SERVICE_KEY ? \cf3 '\uc0\u9989  vorhanden'\cf2  : \cf3 '\uc0\u10060  fehlt'\cf2 );
\f0\fs24 \cf0 \
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0
\cf0 const supabase = createClient(supabaseUrl, supabaseKey);\
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