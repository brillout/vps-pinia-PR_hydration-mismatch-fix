import { matchRouteString } from './matchRouteString'
import { higherFirst } from './utils'

export { resolveRouteString }
export { resolveRouteStringPrecedence }
export { isStaticRoute }

function resolveRouteString(routeString: string, urlPathname: string): null | { routeParams: Record<string, string> } {
  return matchRouteString(routeString, urlPathname)
}

type RouteMatch = {
  routeString?: string
}
// -1 => routeMatch1 higher precedence
// +1 => routeMatch2 higher precedence
function resolveRouteStringPrecedence(routeMatch1: RouteMatch, routeMatch2: RouteMatch): 0 | -1 | 1 {
  if (!routeMatch2.routeString) {
    return 0
  }
  if (!routeMatch1.routeString) {
    return 0
  }

  // Return route with highest number of static path segments at beginning first
  {
    const getValue = (routeString: string) => analyzeRouteString(routeString).numberOfStaticSegmentsBeginning
    const result = higherFirst(getValue)(routeMatch1.routeString, routeMatch2.routeString)
    if (result !== 0) {
      return result
    }
  }

  // Return route with highest number of static path segments in total first
  {
    const getValue = (routeString: string) => analyzeRouteString(routeString).numberOfStaticSegements
    const result = higherFirst(getValue)(routeMatch1.routeString, routeMatch2.routeString)
    if (result !== 0) {
      return result
    }
  }

  // Return route with most parameter segements first
  {
    const getValue = (routeString: string) => analyzeRouteString(routeString).numberOfParameterSegments
    const result = higherFirst(getValue)(routeMatch1.routeString, routeMatch2.routeString)
    if (result !== 0) {
      return result
    }
  }

  // Return catch-all routes last
  {
    if (analyzeRouteString(routeMatch2.routeString).isCatchAll) {
      return -1
    }
    if (analyzeRouteString(routeMatch1.routeString).isCatchAll) {
      return 1
    }
  }

  return 0
}
function analyzeRouteString(routeString: string) {
  const pathSegments = routeString.split('/').filter((path) => path !== '' && path !== '*')

  const isStatic = (path: string) => !path.startsWith(':')

  let numberOfStaticSegmentsBeginning = 0
  for (const path of pathSegments) {
    if (!isStatic(path)) {
      break
    }
    numberOfStaticSegmentsBeginning++
  }

  const numberOfStaticSegements = pathSegments.filter((p) => isStatic(p)).length
  const numberOfParameterSegments = pathSegments.filter((p) => !isStatic(p)).length

  const isCatchAll = routeString.endsWith('*')

  return { numberOfParameterSegments, numberOfStaticSegmentsBeginning, numberOfStaticSegements, isCatchAll }
}

function isStaticRoute(routeString: string): boolean {
  const url = routeString
  const match = resolveRouteString(routeString, url)
  return match !== null && Object.keys(match.routeParams).length === 0
}
