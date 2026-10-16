// Original reference designs using fictional equipment and public documentation.
// These articles do not describe an employer, customer or private deployment.
export const foundationArticles = [
  {
    id: 'ai-api',
    slug: 'reliable-ai-service',
    title: 'From an API call to a reliable AI service',
    technology: 'Model APIs · operation state · streaming',
    summary: 'Make generation a recoverable application operation with clear permissions, deadlines and a saved result.',
    purpose: 'A maintenance assistant turns approved service notes into a short equipment summary. An engineer needs to know whether the summary is still being generated, was interrupted, or is safely saved. That user promise determines the service contract before the choice of model or SDK.',
    example: 'This is an original, provider-neutral reference design for a fictional maintenance assistant. The pseudocode and fake-provider evaluation are illustrative and have not been executed. It generates drafts; it cannot change equipment settings or issue maintenance instructions.',
    readMinutes: 8,
    diagramKey: 'api',
    sections: [
      {
        id: 'operation',
        title: 'Give the user request a durable identity',
        paragraphs: [
          'The question is simple: “Summarise Pump A’s last inspection and list unresolved observations.” The service receives an equipment reference and an inspection revision. Its output is a draft tied to those inputs. The model should not choose an arbitrary asset, silently fetch newer observations, or turn a descriptive summary into permission to operate the machine.',
          'Create an application operation before starting generation. Store its owner, input revision, request fingerprint, deadline and current state. A repeated submission with the same caller-scoped request key returns the existing operation. Reusing that key with different input produces a conflict. This prevents a double click from creating two user-visible summaries without assuming the provider offers an idempotency feature.',
          'The operation record is also a recovery point. A reconnect asks for its state instead of guessing from the last text visible in the browser. Application identity, provider request identity and individual attempt identity serve different purposes and belong in separate fields.',
        ],
      },
      {
        id: 'permissions',
        title: 'Authenticate the caller, then authorise the work',
        paragraphs: [
          'Authentication establishes who is asking. Authorisation decides whether that identity may read this inspection and create a summary in this workspace. Check those permissions in the application and again when reading the source. A provider API credential identifies the application to its supplier; it does not establish the user’s equipment permissions.',
          'Keep provider credentials on the server and expose a narrow operation contract. The browser supplies validated asset and revision identifiers, rather than arbitrary provider URLs, model credentials or tool definitions. OWASP recommends denying access by default and validating permissions on every request; the status and saved-result endpoints need those checks too.',
          'Pass only the approved inspection content to the model. Store a source manifest alongside the operation so that a reviewer can identify what informed the draft. Protect that manifest and diagnostic logs with the same care as the underlying notes.',
        ],
        reference: { label: 'OWASP: authorisation checks and least privilege', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html' },
      },
      {
        id: 'adapter',
        title: 'Make the provider adapter explicit',
        paragraphs: [
          'An adapter translates the application request into one provider’s message format and translates its response into a small internal contract. Record the exact model identifier, adapter version, prompt version and source revisions for each attempt. Similar-looking model APIs can differ in supported roles, output limits, refusal behaviour and tool semantics.',
          'For this design, the adapter returns content, a provider request identifier, usage when available, and a normalised finish category. Completion, truncation, refusal and transport failure remain distinct. A valid JSON object still needs application checks: the returned equipment identifier must match Pump A, observations must refer to supplied evidence, and the output must fit the draft schema.',
          'Keep a provider’s raw finish details for protected diagnostics. Normalisation should simplify product behaviour without hiding information needed to investigate an unexpected outcome.',
        ],
        codeCaption: 'Illustrative contract · the operation owns state; an attempt owns one provider call',
        code: `operation = accept_once(caller, request_key, input_fingerprint)
attempt = begin_attempt(operation.id, deadline)
reply = adapter.generate(approved_context, deadline, cancel_signal)

if reply.finish != "complete":
    settle_attempt(attempt, reply.finish)
else:
    draft = validate_draft(reply.content, expected_asset="pump-a")
    commit_if_active(operation.id, attempt.id, draft, source_manifest)`,
      },
      {
        id: 'stream',
        title: 'Separate streamed text from a saved result',
        paragraphs: [
          'Streaming improves feedback by displaying content as it arrives. It also introduces partial output: a sentence or JSON object may stop halfway through. For example, Claude’s documented stream contains lifecycle events and can deliver an error after streaming has started. Each adapter must interpret its own provider’s terminal events.',
          'The browser can show an explicit generating state while buffering preview text. The application marks the result ready only after receiving a valid completion, validating the assembled output and committing the draft with its evidence manifest. A connection closing, an HTTP success status or the last visible token cannot substitute for that transaction.',
          'If persistence fails after generation succeeds, retain an explicit recovery outcome rather than labelling the draft saved. A proposed event stream uses an operation ID and increasing event sequence so a reconnect can detect missing events and fetch authoritative state. Persisting every token is optional; persisting the settled result is part of this design’s promise.',
        ],
        reference: { label: 'Claude documentation: streaming events and in-stream errors', href: 'https://platform.claude.com/docs/en/build-with-claude/streaming' },
      },
      {
        id: 'retry',
        title: 'Budget deadlines and retries together',
        paragraphs: [
          'Assign an overall deadline, a connection timeout and a maximum interval without useful stream activity. The last two cannot replace the overall limit: a provider that emits occasional fragments could otherwise keep an operation alive indefinitely. Include queueing, context preparation, provider attempts and persistence in the user-facing deadline.',
          'A transient failure may justify another attempt within the remaining budget. Give retry ownership to one layer, bound the attempt count and add backoff with jitter. Independent retries in the SDK, gateway and worker multiply traffic. A timeout also leaves the remote outcome uncertain; it does not prove generation never occurred or that no usage was incurred.',
          'Handle throttling separately from invalid input. HTTP 429 can include Retry-After; respect it when present and when the deadline permits. Do not retry a forbidden source read or the same malformed request. A second generation may produce different wording, so the product needs a policy for accepting one attempt and discarding late competing output.',
        ],
        reference: { label: 'AWS Builders’ Library: timeouts, bounded retries and jitter', href: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/' },
      },
      {
        id: 'cancellation',
        title: 'Define what cancellation actually stops',
        paragraphs: [
          'Closing the preview or aborting a browser fetch only proves that the client stopped waiting. An explicit cancel action should reach the application operation, stop queued work, signal an active adapter and prevent subsequent publication. Whether the supplier stops computation or billing depends on its API and the timing of cancellation.',
          'Resolve completion and cancellation through conditional state transitions. If cancellation commits first, a late provider reply cannot publish a new draft. If readiness commits first, the cancel action returns that settled state. Do not promise that cancellation erases a result already saved or retracts content already sent to a provider.',
        ],
        table: { headings: ['Observation', 'Meaning in this design'], rows: [
          ['Preview text appeared', 'Some output arrived; the draft is still provisional'],
          ['Provider completed', 'The adapter received a complete response'],
          ['Draft is ready', 'Validated output and its manifest were committed'],
          ['Cancellation accepted', 'The application prevents later publication'],
        ] },
      },
      {
        id: 'evaluation',
        title: 'Test the protocol with a controllable provider',
        paragraphs: [
          'Start with one authored inspection: Pump A, revision 3, two observations and one unresolved item. A fake provider can return the expected draft or pause at named barriers. Use a fake clock and fixed retry jitter for deterministic protocol tests; those timings are test inputs, not provider latency measurements.',
          'Run scripts for a partial stream followed by failure, a complete but invalid asset ID, throttling followed by success, deadline expiry, a lost completion acknowledgement and cancellation racing with commit. Assert the settled operation, published draft count, attempt count and retained source revision. Restart the worker before finalisation to exercise recovery.',
          'Then evaluate real model quality separately with a disclosed fixture and pinned configuration. Measure unsupported claims and omission of the unresolved item alongside time to first content, time to ready and actual usage. A perfect fake-provider test verifies application behaviour; it provides no evidence of model accuracy.',
        ],
      },
      {
        id: 'tradeoffs',
        title: 'Choose the smallest boundary that owns the promise',
        paragraphs: [
          'A direct provider call can suit a disposable prototype. An application adapter adds permission enforcement, recoverable operations and a consistent product state. A shared gateway can centralise quotas and provider policy across applications, but adds another dependency and does not make different models interchangeable.',
          'For this assistant, the useful success condition is a saved, attributable draft. The operation record, adapter and state transitions make that condition observable. They do not establish that the interpretation is correct or that a machine is safe to run; those require domain review and a different product contract.',
        ],
      },
    ],
    references: [
      { label: 'RFC 9110 (June 2022): HTTP semantics and idempotent methods', href: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods' },
      { label: 'RFC 6585 (April 2012): HTTP 429 and Retry-After', href: 'https://www.rfc-editor.org/rfc/rfc6585.html#section-4' },
      { label: 'AWS Builders’ Library: timeouts, retries and backoff with jitter', href: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/' },
      { label: 'Claude streaming documentation · consulted 16 October 2026', href: 'https://platform.claude.com/docs/en/build-with-claude/streaming' },
      { label: 'OWASP authorisation guidance · consulted 16 October 2026', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html' },
    ],
  },
  {
    id: 'ai-context',
    slug: 'context-as-a-data-pipeline',
    title: 'Context is a data pipeline',
    technology: 'Context assembly · provenance · token budgets',
    summary: 'Build an inspectable request from permitted, current evidence while preserving the question and its corrections.',
    purpose: 'An engineer changes the conversation from Pump A to Pump B and corrects a service date. The assistant should answer the new question using current evidence. A long transcript alone cannot show whether the model received the right equipment, date or document revision.',
    example: 'The context compiler, manifest and fixture below are original reference designs for a fictional maintenance assistant. Code and evaluation procedures are illustrative and unexecuted. No model window size, token estimate or quality result is claimed for a deployed system.',
    readMinutes: 8,
    diagramKey: 'context',
    sections: [
      {
        id: 'inputs',
        title: 'Start with the decision this request must support',
        paragraphs: [
          'The current question is: “For Pump B, using the corrected inspection date of 12 May, what remains unresolved?” A previous turn discussed Pump A and mistakenly recorded 10 May. The next model request needs Pump B’s identity, the explicit correction, the relevant inspection and any applicable reference material. Replaying every earlier turn is only one possible assembly policy.',
          'Separate application instructions, the current question, historical messages, derived summaries, retrieved documents and tool results. They have different authority and freshness. An inspection excerpt is evidence about equipment; it does not acquire permission to change application rules because it appears inside a prompt.',
          'Define the compiler’s output as a provider-ready packet plus an inspectable manifest. Its contract is that each admitted source is permitted, identifiable and within budget. It cannot promise that the model will attend to every passage or interpret it correctly.',
        ],
      },
      {
        id: 'stored-sent',
        title: 'Distinguish what is stored from what is sent',
        paragraphs: [
          'A chat database can retain the complete conversation while each request contains a selected subset. A user-visible message may have been omitted, summarised or replaced by a newer correction. Conversely, a tool response may enter a request without being displayed in the same form in the chat interface.',
          'Build the manifest from the final serialised request, after provider adaptation and trimming. Capture source IDs, revisions, content digests, selection reasons and the applied policy version. For a provider-managed conversation, record the conversation handle and documented state behaviour; a local message list alone would not establish the complete input.',
          'A digest helps detect changed bytes and duplicate content. It neither establishes truth nor replaces protected retention of the exact packet when auditability requires it. Request snapshots, source manifests and debug logs can contain sensitive information and need explicit access and retention rules.',
        ],
        codeCaption: 'Illustrative context manifest · all identifiers and figures are fictional',
        code: `{
  "questionId": "q-17",
  "policyVersion": "context-v1",
  "subject": "pump-b",
  "sources": [
    { "id": "turn-16", "kind": "correction", "reason": "current date" },
    { "id": "inspection-b", "revision": 3,
      "reason": "selected equipment", "digest": "example-content-digest" }
  ],
  "excluded": [{ "id": "inspection-a", "reason": "different subject" }],
  "inputBudgetTokens": 12000,
  "countMethod": "pinned-adapter-token-counter"
}`,
      },
      {
        id: 'eligibility',
        title: 'Establish eligibility before ranking relevance',
        paragraphs: [
          'Resolve workspace scope and source permissions before constructing candidates. Recheck permission when fetching content and before dispatch if access may change during assembly. A relevant document can still be forbidden; relevance ranking is not an access-control mechanism. OWASP’s request-level authorisation guidance applies to these background reads as well as visible screens.',
          'Revocation also affects derived material. A cached excerpt or conversation summary may contain text from a source the user can no longer read. Track dependencies so that future packets can exclude or rebuild affected derivatives. Invalidating the original document lookup while retaining its text in a summary would leave an incomplete revocation path.',
          'Revocation cannot retract bytes already transmitted. Define separately how an in-flight operation is cancelled, whether a completed answer remains accessible, and how retained snapshots are governed. These are application policy choices requiring enforcement beyond prompt wording.',
        ],
        reference: { label: 'OWASP: validate access on each resource request', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html' },
      },
      {
        id: 'corrections',
        title: 'Carry corrections as explicit state changes',
        paragraphs: [
          'An early summary might say “Pump A, inspection on 10 May.” Appending “actually 12 May” to a large transcript leaves the relationship ambiguous after later topic changes. Preserve a correction with its target fact, source turn and scope: the inspection date for Pump B is 12 May. Keep the original event for history while marking the earlier interpretation superseded.',
          'A user correction updates the stated task context; it does not rewrite an authoritative maintenance record. If the source inspection still says 10 May, include that conflict and ask which record should govern the answer. The model should not silently turn a conversational claim into a corrected database value.',
          'Derived summaries need revision and invalidation rules. Regenerate a summary affected by the correction, or omit it until reconciled. A fluent summary can preserve an error more efficiently than the original transcript, which makes provenance useful precisely when a summary looks plausible.',
        ],
      },
      {
        id: 'budget',
        title: 'Budget tokens using the actual request format',
        paragraphs: [
          'A character cap is useful for bounding uploads and memory consumption. It is not a token counter: language, punctuation, code and the provider’s representation change the relationship. Use the configured model’s counter or documented estimate over the complete message structure, including tool definitions and other supported input types. Reconcile estimates against reported usage.',
          'For a fictional 16,000-token application budget, reserve 2,000 for output and 2,000 as operational headroom, leaving at most 12,000 for input. These figures illustrate arithmetic, not a model capability. Pin the adapter and model configuration and verify how that provider accounts for input, output and additional features.',
          'Admission should protect the question, required instructions and necessary evidence first. Deduplicate exact content while preserving each source reference, then remove low-value historical material or fetch a smaller relevant section. Stop when the evidence is sufficient; spare capacity is not a requirement to include more text. If essential input still cannot fit, narrow the task or explain the missing scope.',
        ],
        reference: { label: 'Claude documentation: counting a structured request before generation', href: 'https://platform.claude.com/docs/en/build-with-claude/token-counting' },
      },
      {
        id: 'mechanisms',
        title: 'Choose a mechanism for the information it preserves',
        paragraphs: [
          'Replay, summaries, retrieval and caching solve different problems. Full replay preserves original wording but grows with the conversation. A summary is a lossy transformation. On-demand retrieval selects source material for the current question and may omit an important dependency. Each needs a separate failure case.',
          'Prompt caching can reduce repeated-prefix processing under a provider’s contract; it does not make that text disappear from the context window. Persisted memory stores information across interactions, while compaction changes the material used to continue a conversation. Neither name establishes that corrections or source permissions have been handled.',
        ],
        reference: { label: 'Claude documentation: context windows and cached input accounting', href: 'https://platform.claude.com/docs/en/build-with-claude/context-windows' },
        table: { headings: ['Mechanism', 'Useful property', 'Failure to examine'], rows: [
          ['Full-history replay', 'Original sequence and wording', 'Old claims dominate the new subject'],
          ['Derived summary', 'Compact continuity', 'Correction or caveat lost during compression'],
          ['Selected evidence', 'Current task scope', 'Relevant source never admitted'],
          ['Cached prefix', 'Reuse under provider rules', 'Stale or newly forbidden material reused'],
        ] },
      },
      {
        id: 'authority',
        title: 'Preserve the boundary between evidence and instructions',
        paragraphs: [
          'Render documents and tool results as labelled data with clear source boundaries. A handbook sentence asking the assistant to ignore the user remains document content. Delimiters and role separation help communicate intent, but prompt injection cannot be eliminated by formatting alone; tool permissions and output handling still need deterministic controls.',
          'Keep complete task-relevant units when trimming. Cutting halfway through a warning can remove the condition that gives it meaning. Record when a passage was shortened, and provide a bounded read path for missing context. Contradictory document versions should trigger version resolution or an explicit uncertainty statement, rather than an arbitrary winner selected by prompt position.',
        ],
        reference: { label: 'OWASP: indirect prompt injection and defence layers', href: 'https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html' },
      },
      {
        id: 'evaluation',
        title: 'Evaluate the packet before evaluating the answer',
        paragraphs: [
          'Create a fixed fixture with Pump A and Pump B inspections, a superseded manual, an access-restricted report and a summary containing the old date. Write expected source inclusions and exclusions for five questions: the initial task, a subject switch, a correction, an oversized attachment and a request after access revocation.',
          'Run the compiler without a model and compare the serialised packets and manifests with those expectations. Measure required-evidence coverage, forbidden-source inclusion, duplicate material and budget compliance. Force a permission change between selection and dispatch. Use a controlled token-counter stub for boundary tests, then check the actual configured counter separately.',
          'Finally, run a disclosed model configuration repeatedly over the same packets and score answer support, correction handling and clarification behaviour. This separates assembly failures from generation failures. A manifest proves what was provided; a correct answer requires its own evidence.',
        ],
      },
    ],
    references: [
      { label: 'Claude token-counting documentation · consulted 16 October 2026', href: 'https://platform.claude.com/docs/en/build-with-claude/token-counting' },
      { label: 'Claude context-window documentation · consulted 16 October 2026', href: 'https://platform.claude.com/docs/en/build-with-claude/context-windows' },
      { label: 'OWASP authorisation guidance · consulted 16 October 2026', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html' },
      { label: 'OWASP prompt-injection prevention · consulted 16 October 2026', href: 'https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html' },
    ],
  },
  {
    id: 'ai-wiki',
    slug: 'index-then-read',
    title: 'Index then read: retrieval without a vector database',
    technology: 'Two-pass retrieval · source eligibility · citation checks',
    summary: 'Use a small curated page index to select references, then read the evidence before drafting an answer.',
    purpose: 'A maintenance team has a compact, carefully authored wiki. The assistant should find the applicable procedure, read its current text and explain what supports the answer. A two-pass reader makes those selections visible without requiring an embedding index.',
    example: 'The wiki, page references and pseudocode are original fictional fixtures. This is a proposed reference design; selection quality, costs and latency have not been measured. It describes a maintenance reading assistant, with no authority to operate machinery.',
    readMinutes: 8,
    diagramKey: 'wiki',
    sections: [
      {
        id: 'workload',
        title: 'Choose a collection that fits in an honest index',
        paragraphs: [
          'The question is: “Which inspection procedure applies to Pump B, and what should the reviewer record?” Our small wiki has stable page IDs, concise authored descriptions, equipment scope and version metadata. The first pass sees that index and proposes page references. The second pass receives the actual selected content and drafts a sourced explanation.',
          'This works only if the index is a useful representation of the permitted collection. A page description that omits an unusual procedure can make the right content invisible to selection. The approach trades embedding infrastructure for index curation, an additional selection call and a finite amount of index text in each request.',
          'Begin with a collection small enough to inspect. Growth requires a deliberate next step, such as hierarchical navigation, lexical candidate search or another retrieval system. Silently clipping the last half of an alphabetical index makes coverage depend on page order.',
        ],
        table: { headings: ['Fictional page', 'Revision and role'], rows: [
          ['pump-b-inspection', '3 · current inspection procedure'],
          ['pump-b-inspection-archive', '2 · superseded procedure'],
          ['pressure-troubleshooting', '4 · cross-equipment diagnostic context'],
          ['lubricant-guide', '1 · unrelated to this question'],
          ['restricted-review', '2 · excluded for this caller'],
          ['inspection-record-template', '2 · fields the reviewer records'],
        ] },
      },
      {
        id: 'eligible-index',
        title: 'Build a caller-specific, versioned index',
        paragraphs: [
          'Compute the eligible-source set through application permissions before exposing titles or descriptions. Restricted metadata can itself disclose information. The selector receives only eligible IDs, descriptions, revision identifiers and useful scope fields. Archive status is separate from authorisation: an engineer may be permitted to read an old procedure while it remains unsuitable for current work.',
          'Capture an index revision and content digest for each entry. A description should be updated when its page changes, and the system should detect an index entry pointing at a missing revision. Recheck permission during the content read. OWASP recommends authorisation at each resource request; a model’s proposed page list cannot grant access.',
          'For this question, the selector can see the current procedure, troubleshooting guide and record template. The restricted review never enters either pass. The archive is labelled superseded, so a request for the current procedure can apply an explicit eligibility rule rather than hoping the model notices a date.',
        ],
        reference: { label: 'OWASP: resource-level authorisation and deny-by-default behaviour', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html' },
      },
      {
        id: 'selection',
        title: 'Let the model propose references, then validate them',
        paragraphs: [
          'Ask the first pass for a bounded list of page IDs and a short relevance reason. Give it an explicit no-match option. The selector interprets the descriptions and can connect a paraphrased question to the right topic, but that interpretation is model-assisted and may vary between runs.',
          'The application validates the response structure, maximum count, unique IDs and membership in the eligible index. JSON Schema can express structural constraints; membership, current permissions and version policy remain application checks. A syntactically valid invented page ID is still invalid selection. Do not transform a returned string into an arbitrary URL or filesystem path.',
          'Reasons are useful diagnostics, not evidence that the chosen page contains the answer. In this fixture, selecting pump-b-inspection and inspection-record-template is a candidate plan. Only their content reads can establish what the answerer actually received.',
        ],
        reference: { label: 'JSON Schema Draft 2020-12: validation vocabulary', href: 'https://json-schema.org/draft/2020-12/json-schema-validation' },
        codeCaption: 'Illustrative orchestration · selector output never becomes direct file access',
        code: `index = build_eligible_index(caller, collection_revision)
selection = select_pages(question, index, max_pages=3)
ids = validate_selection(selection, allowed_ids=index.ids)

if not ids:
    return no_evidence("No eligible page matched this question")

pages = read_authorised_revisions(caller, ids, index.revisions)
evidence = validate_nonempty_content(pages)
if not evidence:
    return no_evidence("Selected pages supplied no usable content")

draft = answer_from_pages(question, evidence)
return check_claim_references(draft, evidence)`,
      },
      {
        id: 'reads',
        title: 'Read the evidence before asking for the answer',
        paragraphs: [
          'Fetch the selected revisions through a controlled reader and build a manifest from the returned content. Include page ID, revision, digest and section identifiers. Deduplicate identical text to save context while retaining all provenance mappings. Similar titles do not establish identical content, and a digest does not establish factual correctness.',
          'If the current revision changed since selection, either read the pinned permitted revision under an explicit historical policy or rebuild the index and selection. For a current-procedure question, this design restarts against the new revision. Bound that restart so rapidly changing content produces a visible retry outcome rather than an endless loop.',
          'An empty, inaccessible or oversized page requires an explicit decision. Do not answer from its description as though it were the page. Read a bounded section with its heading and caveats, or disclose the missing evidence. Leave enough input budget for the question and enough output budget for the answer.',
        ],
      },
      {
        id: 'citations',
        title: 'Validate source references separately from claim support',
        paragraphs: [
          'Ask the answerer to associate each substantive claim with an admitted page and section. Validate that every reference exists in the supplied evidence and points to a real span or section. A fabricated citation is a structural failure. A real citation attached to an unsupported conclusion is a different failure and requires semantic review.',
          'Provider citation features can return structured locations into supported document inputs. Their exact content types and location formats are provider-specific. Whether using that feature or a custom format, a valid location does not guarantee that an entire sentence follows from the cited passage.',
          'In our fixture, the procedure supplies the inspection steps and the template supplies the recording fields. Preserve that distinction in the answer. The assistant must not infer an operating pressure from a diagnostic example or present an archived instruction as current. Treat page content as untrusted evidence, including any embedded instructions aimed at the assistant.',
        ],
        reference: { label: 'Claude documentation: supported citation inputs and source locations', href: 'https://platform.claude.com/docs/en/build-with-claude/citations' },
      },
      {
        id: 'no-match',
        title: 'Make no evidence a successful retrieval outcome',
        paragraphs: [
          'A question about an equipment model absent from the wiki should take the no-match branch. The product can ask for the model identifier or invite the user to select a permitted manual. It should not fill the gap with a plausible procedure because generation is available.',
          'Distinguish no relevant index entry, invalid selector output, denied content access, empty content and insufficient evidence after reading. These require different recovery actions. Optionally allow one bounded expansion to another eligible page, recording the new selection and its reason. Expansion cannot bypass permissions or convert a broad web search into an undisclosed fallback.',
          'The same discipline applies when an index is incomplete. Missing coverage is a retrieval defect to investigate. Improving the answer prompt cannot recover a page the selector was never allowed to see.',
        ],
      },
      {
        id: 'alternatives',
        title: 'Compare retrieval paths on the actual workload',
        paragraphs: [
          'An explicit user-selected page is predictable when the reader knows the source. Lexical search is efficient and inspectable for exact equipment codes, but its usefulness depends on text and query matching. Model-assisted selection can interpret curated descriptions, at the cost of another inference step and variation in its decisions.',
          'Embedding retrieval becomes attractive when a larger corpus or passage-level semantic search makes a whole-page index awkward. It adds chunking, embedding compatibility, update handling and index evaluation. These mechanisms can be combined: a lexical candidate list may feed a bounded selector, followed by the same authorised page reader.',
          'For a compact curated wiki, index-then-read offers visible navigation and simple source versioning. Its limitations are index maintenance, whole-page context cost and selection misses. Choose it because those trade-offs fit the collection, then measure the fit as the collection evolves.',
        ],
      },
      {
        id: 'evaluation',
        title: 'Measure selection and answering independently',
        paragraphs: [
          'Write the six fictional pages in the table and a checked-in index manifest. Author twelve questions covering direct names, paraphrases, two-page answers, an absent model, a superseded procedure and a restricted topic. Record the expected permitted pages and supported claims before running a selector.',
          'Test validation with a fake selector returning duplicates, invented IDs, excess pages and malformed output. Then test the reader against a changed revision, empty content and access revoked after selection. Assert that no forbidden metadata or text enters either request. These deterministic checks do not measure a real model’s retrieval ability.',
          'For a disclosed model configuration, repeat each question and report page-selection precision and recall, no-match behaviour, selected-page count, input usage and both pass latencies. Score citation validity and claim support separately. Compare with explicit references and a lexical baseline over the same collection. No results are reported here; this protocol defines the evidence needed before claiming an improvement.',
        ],
      },
    ],
    references: [
      { label: 'JSON Schema Draft 2020-12: validation vocabulary', href: 'https://json-schema.org/draft/2020-12/json-schema-validation' },
      { label: 'Claude citation documentation · consulted 16 October 2026', href: 'https://platform.claude.com/docs/en/build-with-claude/citations' },
      { label: 'OWASP authorisation guidance · consulted 16 October 2026', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html' },
      { label: 'OWASP prompt-injection prevention · consulted 16 October 2026', href: 'https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html' },
    ],
  },
];
