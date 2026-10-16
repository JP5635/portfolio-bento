// Independently authored teaching examples using public technical references.
// These guides do not describe any employer, client or private deployment.
export const engineeringGuides = {
  'credential-access': {
    technology: 'PostgreSQL · transactional outbox',
    title: 'Recoverable operations with a PostgreSQL outbox',
    summary: 'Give accepted background work a durable handoff, then make the ambiguous outcomes explicit.',
    purpose: 'A document application accepts an export request and asks an external service to render the file. The user needs the accepted request to remain recoverable if a process stops at an inconvenient moment. The design goal is a durable record of intended work, a bounded retry policy and a way to explain the request’s current state.',
    example: 'The export service and SQL below are original teaching examples. They illustrate a protocol; authentication, table definitions and provider integration would need their own implementation.',
    sections: [
      {
        title: 'Locate the gap between a commit and a side effect',
        paragraphs: [
          'Consider two steps: save the request in PostgreSQL, then call the renderer. A crash after the first step leaves accepted work with no delivery attempt. Reversing the order creates another gap: the renderer may start work before the database records that the request exists.',
          'A transactional outbox stores the application change and a work record in one database transaction. A worker later reads the work record and performs the external action. The transaction protects that local handoff. The provider remains a separate system with its own outcome.',
        ],
        reference: { label: 'AWS Prescriptive Guidance: transactional outbox pattern', href: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html' },
        codeCaption: 'Illustrative SQL · accept a new logical request',
        code: `BEGIN;
INSERT INTO export_request (id, state)
VALUES ($1, 'pending');

INSERT INTO outbox_job (operation_id, available_at, attempts)
VALUES ($1, now(), 0);
COMMIT;`,
        after: 'Use a stable operation identifier. A uniqueness constraint and the request handler’s conflict path should return the existing operation when the caller repeats an accepted request. A new random identifier for every HTTP retry would turn one intent into multiple exports.',
      },
      {
        title: 'Specify the worker contract',
        paragraphs: [
          'The teaching model uses export_request for the user-facing state and outbox_job for delivery coordination. The latter stores operation_id, available_at, attempts, lease_token, lease_until and finished_at. Define the meanings of pending, processing, completed and failed before connecting them to a progress display.',
          'The useful invariants are precise: every accepted request has a work record; every retry keeps the same operation identity; only the current lease holder may finalise its attempt; and a completed request refers to a confirmed provider result. None of these follows from an HTTP 202 response alone.',
        ],
        table: { headings: ['Boundary', 'Evidence to record'], rows: [
          ['Request accepted', 'Application row and work row committed together'],
          ['Attempt claimed', 'Operation ID, lease token and lease expiry'],
          ['Provider outcome known', 'Stable provider result or explicit failure'],
          ['Request settled', 'User-facing state and work record updated together'],
        ] },
      },
      {
        title: 'Claim work in a short transaction',
        paragraphs: [
          'PostgreSQL supports FOR UPDATE SKIP LOCKED for queue-like consumers. A worker can skip rows another transaction is claiming instead of waiting behind them. This is a work-allocation mechanism; it is unsuitable for a query that must return a complete, consistent view of the queue.',
          'Persist a lease before making the remote call. Keep the claiming transaction short: holding database locks through an unpredictable network operation consumes connection capacity and delays other work. The sample uses a thirty-second lease only to illustrate the mechanism; a real lease duration needs an explicit renewal and timeout policy.',
        ],
        reference: { label: 'PostgreSQL SELECT: locking clauses and SKIP LOCKED', href: 'https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE' },
        codeCaption: 'Illustrative SQL · $1 lease token, $2 batch limit, $3 attempt limit',
        code: `WITH candidates AS (
  SELECT operation_id
  FROM outbox_job
  WHERE finished_at IS NULL
    AND available_at <= now()
    AND (lease_until IS NULL OR lease_until < now())
    AND attempts < $3
  ORDER BY available_at, operation_id
  LIMIT $2
  FOR UPDATE SKIP LOCKED
)
UPDATE outbox_job AS job
SET lease_token = $1,
    lease_until = now() + interval '30 seconds',
    attempts = job.attempts + 1
FROM candidates
WHERE job.operation_id = candidates.operation_id
RETURNING job.operation_id, job.lease_token;`,
        after: 'Commit the claim before contacting the provider. When acknowledging success or scheduling a retry, condition the database update on the operation ID and current lease token, and check the affected-row count. An expired worker must not overwrite the decision of a newer owner.',
      },
      {
        title: 'Handle the uncertain outcome deliberately',
        paragraphs: [
          'The difficult case is a provider that completes the export just before the worker loses its connection. A timeout tells the worker that it lacks an answer; it does not establish whether the side effect happened. Retrying with a new identity can create duplicate work.',
          'If the provider supports idempotency, send the stable operation ID and understand the provider’s key scope and retention period. Otherwise, use an operation-status lookup or reconciliation path before issuing another action. A local lease token protects local updates; it cannot stop an old worker’s remote call after its lease expires.',
          'Treat transient transport failures, throttling and invalid requests separately. Schedule eligible retries with a bounded delay and jitter. An attempt limit should settle the request into a visible failure or review state, rather than leave an exhausted row silently pending.',
        ],
      },
      {
        title: 'Finalise related state atomically',
        paragraphs: [
          'After a confirmed provider result, update the user-facing request and the outbox record in one short transaction. First verify that the worker still owns an unexpired lease. If the conditional update affects no row, stop that finalisation path and reconcile rather than writing an unconditional success.',
          'Define what completed means for the product. A renderer accepting a job may establish submission while the file is still being generated. If the user’s promise is that a downloadable artifact exists, model submission and artifact readiness as separate milestones.',
        ],
        reference: { label: 'PostgreSQL tutorial: atomic transaction boundaries', href: 'https://www.postgresql.org/docs/current/tutorial-transactions.html' },
      },
      {
        title: 'Test the crash windows',
        paragraphs: [
          'Use a controllable fake renderer to pause execution at each boundary. The objective is to demonstrate recovery from specific interruptions, not to obtain one successful run of the happy path.',
        ],
        list: [
          'Stop after the local commit and before delivery: the work remains claimable.',
          'Run two workers concurrently: a live lease prevents both from finalising the same local attempt.',
          'Let a lease expire during a slow call: the stale worker cannot settle a newer attempt.',
          'Lose the response after provider success: the stable identity or lookup resolves the ambiguity.',
          'Reach the attempt limit: the request has an inspectable terminal outcome and controlled recovery action.',
        ],
        after: 'Record operation identity, attempt number, transition, elapsed time and provider outcome without storing sensitive payloads. Queue age and retry distribution help distinguish a slow downstream service from a worker that has stopped making progress.',
      },
      {
        title: 'Choose the pattern for the failure model',
        paragraphs: [
          'A database-backed outbox is useful when the application already depends on a relational transaction and the accepted work must survive a worker restart. It adds polling, retention, lease recovery and operational state that the team must maintain.',
          'For a small disposable task, that cost may be unnecessary. For work that can be repeated safely, a simpler queue contract may suffice. Start with the user promise, identify the crash windows and choose the smallest mechanism that makes those windows recoverable.',
        ],
      },
    ],
  },
  'lakehouse-sync': {
    technology: 'Amazon S3 · multipart upload',
    title: 'Resumable multipart uploads in Amazon S3',
    summary: 'Build recovery around source identity, a durable part manifest and explicit object verification.',
    purpose: 'A large file transfer should recover useful progress after a dropped connection or application restart. The user’s goal is an intact destination object assembled from the intended source file. Designing around that promise makes the checkpoint, completion and verification steps part of the upload protocol.',
    example: 'The manifest and failure scenarios are original teaching examples for Amazon S3. Other object stores can implement different multipart and checksum behaviour; verify their API contracts separately.',
    sections: [
      {
        title: 'Define the unit of recovery',
        paragraphs: [
          'S3 multipart upload separates initiation, part transfer and completion. The application retains an upload ID and records the part number and returned ETag for each accepted part. Completion assembles the supplied parts in part-number order.',
          'A progress percentage cannot reconstruct this state after a restart. Store a durable manifest tied to the exact source bytes, destination key and upload attempt. A stable file name is insufficient if its contents can change while a transfer is paused.',
        ],
        reference: { label: 'Amazon S3: multipart upload overview', href: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html' },
        codeCaption: 'Synthetic manifest fragment · one completed part of an example file',
        code: `{
  "sourceFingerprint": "digest-of-the-original-source",
  "sourceSize": 20971520,
  "objectKey": "examples/sample.bin",
  "uploadId": "example-upload-id",
  "partSize": 8388608,
  "state": "uploading",
  "parts": [
    { "number": 1, "offset": 0, "length": 8388608,
      "etag": "opaque-tag-from-upload-response" }
  ]
}`,
        after: 'The example uses a synthetic 20 MiB file and 8 MiB part size. Values are teaching inputs, not a benchmark or sizing recommendation. A real manifest also needs an explicit checksum policy, schema version and safe local persistence.',
      },
      {
        title: 'Record acknowledgements before counting progress',
        paragraphs: [
          'Treat a part as confirmed only after the service accepts it and its metadata has been checkpointed. Bytes handed to a network socket are not the same as confirmed remote parts. If the process stops between acknowledgement and checkpoint, recovery must reconcile that uncertainty.',
          'Use bounded parallelism so a retry burst does not exhaust memory, sockets or bandwidth. Keep the part boundaries stable for the lifetime of an upload. A retry of one part should preserve its number and byte range; the latest successful response supplies the manifest entry used for completion.',
          'One manifest writer, or an atomic versioned update, prevents concurrent workers from losing one another’s acknowledgements. A temporary file followed by an atomic replacement is one possible local checkpoint strategy; the actual crash-durability guarantee depends on the filesystem and persistence mechanism.',
        ],
      },
      {
        title: 'Reconcile a restart before sending more data',
        paragraphs: [
          'First validate the source fingerprint and destination identity. If either has changed, stop the old attempt and start a deliberate new one. Continuing with mixed source versions can produce an object whose individual parts uploaded successfully but whose overall content is wrong.',
          'Inspect the service’s part listing against the application manifest, including pagination. AWS recommends retaining your own part-number/ETag list for completion and using listings for verification. Do not replace the manifest blindly with a listing that lacks your intended byte ranges and source identity.',
        ],
        table: { headings: ['Observed state', 'Recovery decision'], rows: [
          ['Part recorded locally and confirmed remotely', 'Keep the checkpoint and verify its identity'],
          ['Acknowledgement missing from the manifest', 'Reconcile or re-upload that stable part before completion'],
          ['Manifest part absent remotely', 'Re-upload the expected byte range'],
          ['Upload ID is no longer active', 'Check destination completion before starting a new upload'],
          ['Source fingerprint changed', 'Stop; do not combine old and new source bytes'],
        ] },
      },
      {
        title: 'Model completion as a recoverable transition',
        paragraphs: [
          'Before completing, check that every expected byte range is represented exactly once and the selected parts are ordered. Persist a completing state before the remote call, so a restarted application knows it may need to resolve an in-flight completion.',
          'S3’s CompleteMultipartUpload can send an initial HTTP 200 and later contain an error in the response body. Use an AWS SDK’s completion handling or parse the full response when working directly with the REST API. A successful status line is not a sufficient application-level completion check.',
          'If the completion response is lost, inspect the destination and active upload before deciding to retry or restart. Prefer a unique object key for an upload attempt, or track a destination version, so an unrelated object cannot be mistaken for the completed transfer.',
        ],
        reference: { label: 'Amazon S3 API: CompleteMultipartUpload response semantics', href: 'https://docs.aws.amazon.com/AmazonS3/latest/API/API_CompleteMultipartUpload.html' },
      },
      {
        title: 'Verify integrity using a defined checksum contract',
        paragraphs: [
          'An ETag is useful upload metadata, but a multipart object’s ETag is not a full-file MD5 digest. Choose an S3-supported checksum algorithm and distinguish a full-object checksum from a composite checksum. Compare values only when their algorithm and construction match.',
          'Keep three questions separate: was the object assembled, do its bytes match the intended file, and can the downstream application use it? A Parquet reader opening the footer or a parser validating the file checks another boundary beyond transport integrity.',
          'For the teaching design, success requires a confirmed destination identity, expected object length and an appropriate integrity check. Add format-level validation only when it is part of the product’s contract, and record that result separately from upload completion.',
        ],
        reference: { label: 'Amazon S3: checksum algorithms and full-object/composite checksums', href: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity-upload.html' },
      },
      {
        title: 'Bound the lifetime of abandoned work',
        paragraphs: [
          'A paused upload needs an intentional retention policy. Distinguish a resumable pause from cancellation, then abort an upload when the user cancels or recovery is no longer appropriate. Coordinate cancellation with in-flight workers before assuming all activity has stopped.',
          'An S3 lifecycle rule for incomplete multipart uploads is a useful backstop for abandoned attempts. It also constrains the resume promise: an application cannot guarantee indefinite continuation when the service may remove old parts.',
        ],
        reference: { label: 'Amazon S3: aborting incomplete multipart uploads', href: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/abort-mpu.html' },
      },
      {
        title: 'Exercise recovery with explicit failure injection',
        paragraphs: [
          'Create a small deterministic test file and compare the resulting bytes or supported checksum after each recovery scenario. A large happy-path upload alone says little about how a checkpoint behaves at an interruption boundary.',
        ],
        list: [
          'Interrupt a part transfer; confirm that only uncertain work is repeated.',
          'Stop after a remote acknowledgement and before the local checkpoint.',
          'Restart during completion and reconcile a destination that already exists.',
          'Change the source file while paused and verify that resume is refused.',
          'Cancel during active work and confirm the cleanup outcome.',
        ],
        after: 'The trade-off is extra state and verification work in return for recoverable progress. Start with the smallest failure model the application must support, then make every success condition observable.',
      },
    ],
  },
};
