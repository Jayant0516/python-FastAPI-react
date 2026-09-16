import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

type RequestState = 'idle' | 'loading' | 'success' | 'error'

function App() {
  const [requestState, setRequestState] = useState<RequestState>('idle')
  const [result, setResult] = useState<unknown>(null)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  async function callApi() {
    setRequestState('loading')
    setResult(null)
    setError('')

    try {
      const response = await fetch(API_URL, { headers: { Accept: 'application/json' } })
      const contentType = response.headers.get('content-type') || ''
      const body = contentType.includes('application/json')
        ? await response.json()
        : await response.text()

      if (!response.ok) {
        throw new Error(typeof body === 'string' ? body : JSON.stringify(body))
      }

      setResult(body)
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      setRequestState('success')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The request could not be completed.')
      setRequestState('error')
    }
  }

  const isLoading = requestState === 'loading'

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">A</div>
        <div>
          <p className="eyebrow">Cloud connection</p>
          <h1>Azure API Viewer</h1>
        </div>
        <span className={`status-pill status-${requestState}`}>
          <span className="status-dot" />
          {requestState === 'loading' ? 'Calling API' : requestState === 'error' ? 'Needs attention' : 'Ready'}
        </span>
      </header>

      <section className="intro-grid">
        <div className="intro-copy">
          <p className="kicker">Python API / live response</p>
          <h2>See what your Azure service is saying.</h2>
          <p className="lede">Send a request to your deployed FastAPI endpoint and inspect the response here, without leaving the browser.</p>
          <button className="primary-button" type="button" onClick={callApi} disabled={isLoading}>
            <span>{isLoading ? 'Contacting service' : 'Call Python API'}</span>
            <span className="button-arrow" aria-hidden="true">→</span>
          </button>
        </div>

        <div className="connection-card">
          <div className="card-heading">
            <span className="mini-label">Endpoint</span>
            <span className="live-indicator"><span /> configured</span>
          </div>
          <code>{API_URL}</code>
          <div className="card-footer">
            <span>Method</span><strong>GET</strong>
            <span>Accept</span><strong>JSON</strong>
          </div>
        </div>
      </section>

      <section className="response-section" aria-live="polite">
        <div className="section-heading">
          <div>
            <p className="kicker">Output</p>
            <h3>Latest response</h3>
          </div>
          {lastUpdated && <span className="updated-label">Updated {lastUpdated}</span>}
        </div>

        <div className={`response-panel panel-${requestState}`}>
          {requestState === 'idle' && <div className="empty-state"><span className="empty-icon">↗</span><p>Your API response will appear here.</p><span>Press the button above to make the first request.</span></div>}
          {requestState === 'loading' && <div className="empty-state"><span className="loader" /><p>Waiting for Azure...</p><span>The service is processing your request.</span></div>}
          {requestState === 'error' && <div className="error-state"><span className="error-icon">!</span><div><p>Request failed</p><span>{error || 'Check the endpoint and CORS configuration.'}</span><small>Tip: FastAPI must allow this frontend origin in its CORS middleware.</small></div></div>}
          {requestState === 'success' && <pre>{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</pre>}
        </div>
      </section>

      <footer>Configured with <code>VITE_API_URL</code> <span>•</span> Built for a simple FastAPI response</footer>
    </main>
  )
}

export default App