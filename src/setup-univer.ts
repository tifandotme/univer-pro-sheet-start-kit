import '@univerjs/design/lib/index.css'
import '@univerjs/ui/lib/index.css'
import '@univerjs/sheets-ui/lib/index.css'
import '@univerjs/sheets-formula/lib/index.css'
import '@univerjs/sheets-numfmt/lib/index.css'

import '@univerjs-pro/collaboration-client/lib/index.css'
import '@univerjs-pro/live-share/lib/index.css'
import '@univerjs-pro/sheets-print/lib/index.css'
import '@univerjs-pro/sheets-exchange-client/lib/index.css'

import { LocaleType, LogLevel, Univer, UniverInstanceType } from '@univerjs/core'
import { defaultTheme } from '@univerjs/design'
import { UniverDocsPlugin } from '@univerjs/docs'
import { UniverDocsUIPlugin } from '@univerjs/docs-ui'
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula'
import { UniverRenderEnginePlugin } from '@univerjs/engine-render'
import { UniverSheetsPlugin } from '@univerjs/sheets'
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula'
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt'
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui'
import { UniverUIPlugin } from '@univerjs/ui'
import { FUniver } from '@univerjs/facade'

import { CollaborationPlugin } from '@univerjs-pro/collaboration'
import { CollaborationClientPlugin } from '@univerjs-pro/collaboration-client'
import { LiveSharePlugin } from '@univerjs-pro/live-share'
import { SheetsPrintPlugin } from '@univerjs-pro/sheets-print'
import { UniverSheetsExchangeClientPlugin } from '@univerjs-pro/sheets-exchange-client'

import { locales } from './locale'

export function setupUniver() {
  const univer = new Univer({
    theme: defaultTheme,
    locale: LocaleType.EN_US,
    logLevel: LogLevel.VERBOSE,
    locales,
  })

  univer.registerPlugin(UniverDocsPlugin, {
    hasScroll: false,
  })
  univer.registerPlugin(UniverDocsUIPlugin)
  univer.registerPlugin(UniverRenderEnginePlugin)
  univer.registerPlugin(UniverUIPlugin, {
    container: 'univer',
    header: true,
    footer: true,
  })
  univer.registerPlugin(UniverSheetsPlugin)
  univer.registerPlugin(UniverSheetsUIPlugin)

  univer.registerPlugin(UniverSheetsNumfmtPlugin)
  univer.registerPlugin(UniverFormulaEnginePlugin)
  univer.registerPlugin(UniverSheetsFormulaPlugin)

  // collaboration plugins
  univer.registerPlugin(CollaborationPlugin)
  univer.registerPlugin(CollaborationClientPlugin)
  univer.registerPlugin(LiveSharePlugin)

  // print
  univer.registerPlugin(SheetsPrintPlugin)

  // exchange
  univer.registerPlugin(UniverSheetsExchangeClientPlugin)

  // check if the unit is already created
  const url = new URL(window.location.href)
  const unit = url.searchParams.get('unit')
  if (unit) {
    // waiting for the unit to be loaded
  }
  else {
    fetch(`/universer-api/snapshot/2/unit/-/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: UniverInstanceType.UNIVER_SHEET,
        name: 'New Sheet By Univer',
        creator: 'user',
      }),
    }).then((response) => {
      if (!response.ok)
        throw new Error('Failed to create new sheet')

      return response.json()
    }).then((data) => {
      if (!data.unitID)
        throw new Error('create unit failed')

      url.searchParams.set('unit', data.unitID)
      url.searchParams.set('type', String(UniverInstanceType.UNIVER_SHEET))
      window.location.href = url.toString()
    }).catch((error) => {
      console.error(error)
    })
  }

  return FUniver.newAPI(univer)
}