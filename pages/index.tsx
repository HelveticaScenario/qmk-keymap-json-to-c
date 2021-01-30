import React, { useRef, useState } from 'react'
import { NextPage } from 'next'
import z from 'zod'

const getText = async (ref: React.MutableRefObject<HTMLInputElement | null>) =>
  await (ref.current?.files?.item(0)?.text() ?? Promise.resolve(undefined))

let layersValidator = z
  .object({
    layers: z.array(z.array(z.string())),
  })
  .transform(({ layers }) => layers)

const Home: NextPage = ({}) => {
  const [keymapJsonString, setKeymapJsonString] = useState<string>()
  const [keymapCString, setKeymapCString] = useState<string>()
  const keymapJsonFileRef = useRef<HTMLInputElement | null>(null)
  const keymapCFileRef = useRef<HTMLInputElement | null>(null)

  const onChange = async () => {
    setKeymapJsonString(await getText(keymapJsonFileRef))
    setKeymapCString(await getText(keymapCFileRef))
  }

  let code
  if (keymapJsonString != null && keymapCString != null) {
    let layers: z.infer<typeof layersValidator>
    try {
      layers = layersValidator.parse(JSON.parse(keymapJsonString))
    } catch (e) {
      code = 'keymap.json is invalid'
    }
    if (!code) {
      let regex = /\[(\d+)\]\s*\=\s*LAYOUT\(\s*(?:(?:(?:\w|[()])+)\s*,?\s*)*\)/m
      console.log(keymapCString.match(regex))
    }
  }

  return (
    <div className="flex">
      <label>
        <span>keymap.json</span>
        <input
          type="file"
          accept=".json"
          onChange={onChange}
          ref={keymapJsonFileRef}
        ></input>
      </label>
      <label>
        <span>keymap.c</span>
        <input
          type="file"
          accept=".c"
          onChange={onChange}
          ref={keymapCFileRef}
        ></input>
      </label>
      <code>{code}</code>
    </div>
  )
}
export default Home
