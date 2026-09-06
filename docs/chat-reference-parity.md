# Chat comparison and native image delivery

Reference: [TungTung chat](https://tungtung.noordware.com/chat). Public markup inspected September 5, 2026; authenticated UI inspected September 6 using the account supplied by the user. Login succeeded and the live general channel loaded. No messages, reactions, friend requests, uploads, purchases, channel creation, or account-setting changes were submitted. Credentials and session state were not saved in this repository.

## Authenticated findings

These observations describe accessible UI, not end-to-end verification of writes or deliveries.

| Area | Observed after login | Nebulo comparison / next work |
| --- | --- | --- |
| Message presentation | Compact left-aligned bubbles, grouped messages, quote previews, typing indicator, online list, level and role badges | Existing implementations overlap; retain identity/history fixes and test grouping before changing presentation |
| Message actions | Hover toolbar with five quick reactions, an any-emoji reaction entry point, Reply and Report | Nebulo already has replies/reactions/reports plus bookmarks, edits and pins; its reaction catalog is narrower |
| Emoji | Searchable custom-image emoji picker opens; custom emoji are visible in messages | Custom emoji assets/catalog and safe rendering are a remaining comparison item; do not copy third-party assets automatically |
| Conversations | Separate DM screen with search, All/Unread/Friends/Groups filters, pin/delete controls and New group entry point | Existing DMs/groups overlap; compare filters and pinning. New-group form did not appear during this inspection, so group creation is unverified |
| Friends | Friends, Requests, Sent and Add tabs; requests load | Existing friends/request flows overlap; no request was accepted or declined |
| Privacy | DM choices Everyone/Friends only/No one; friend-request choices Everyone/Friends of friends/No one; separate coin-heist participation setting | Server-enforced granular privacy is a parity item, not just a UI dropdown |
| Private channels | Create/Join chooser and creation form with a channel name and 60-minute/Permanent choices | Distinct from existing group chats; invite lifecycle and authorization need implementation/testing. No channel was created |
| Profile | Avatar picker, custom-upload price, badges, paid display-name changes, name-color unlock, pronouns, favorite game and birthday fields | Nebulo's profiles/cosmetics overlap; extra profile fields and their privacy need design. No coins spent or details saved |
| Appearance | Six font choices and Small/Normal/Large/Huge message sizing, explicitly device-local | Local reading preferences are a useful independent addition |
| Account security | Current/new/confirm password form; Recovery, Blocked and Delete tabs visible | Password form opened without submission; recovery/deletion flows were not exercised |
| Premium | Panel advertises ad-free use, image uploads, profile song and profile effects; membership/key/gift entry points | Image uploads are advertised as Premium on the reference, not evidence of unrestricted image support for this account |
| Rewards | Leaderboard opens with XP/Coins/Rob/Msgs/Streak tabs; Rewards panel opened but remained empty apart from its heading | Do not describe the rewards shop or leaderboard data as verified working |

### Access limits

- The signed-in account's composer has image upload, poll creation, soundboard, voice recording and audio-file controls hidden. Their markup exists, but their availability and behavior could not be verified with this account. No hidden controls or access restrictions were overridden.
- A Join Voice control is available. No call was joined, microphone enabled, or sound sent to other users.
- Owner/admin tools were not exposed to this account. Staff permissions and moderation behavior remain unverified.
- Native image handling below is a Nebulo implementation; the reference's image delivery and moderation backend were not tested.

## Implementation order

1. Preserve and deploy the native-image/history fix; verify image sends and reloads in a Nebulo test room.
2. Add device-local reading preferences, conversation filters/pinning, and expanded emoji support without changing existing message identity/order behavior.
3. Add server-enforced DM/friend privacy and private-channel invite/expiry handling, with permission tests.
4. Specify and implement polls, audio messages and soundboard independently; reference behavior for these remains access-limited.
5. Compare account recovery, moderation and rewards separately rather than assuming hidden controls work.

## Preliminary feature inventory

The following original inventory comes from publicly delivered markup. The authenticated findings above supersede it where applicable. Hidden controls are **not** proof that a feature works or is available to every account.

| Reference controls | Current Nebulo evidence / work remaining |
| --- | --- |
| Friends, requests, groups, conversation search | Existing implementations in the chat client/routes; behavior parity not yet verified |
| General voice, calls, image uploads, emoji | Existing voice/image features; image transport and history fixes implemented in this pass |
| Create poll, option fields, expiration | Candidate addition; not implemented in this pass |
| Voice messages, audio-file upload, soundboard/favorites | Candidate additions; distinct from existing voice calls |
| Private channels with invite codes and expiry | Candidate addition; existing group chats are not equivalent |
| DM privacy: everyone, friends only, off/no one | Reference semantics need verification before matching existing privacy settings |
| Email login code, recovery/backup code, account deletion/restore | Reference flows need authenticated review; do not implement account-security flows based only on labels |
| Daily streak, spin, trivia, leaderboards, premium tiers/keys, coin activities | Existing Nebulo rewards/cosmetics overlap, but substantial unverified differences remain |
| Moderation, bans/mutes, spam guard, audit logs, reports, owner controls | Existing Nebulo moderation overlaps; exact role permissions need authenticated comparison |

No claim of complete feature parity is being made. The supplied login resolved the regular-user inspection blocker; hidden paid/staff features and write workflows remain unverified. This follow-up updates the comparison, not the application feature set.

## Native image fix implemented

- New local uploads retain their `/api/upload/image/:id` references in Nebulo's attachment/history store and reply thumbnails. The old HTTPS-only normalizer silently dropped them.
- The text transport sends only the caption (or `Image attachment` for image-only messages) to TLK. Image markup and native metadata remain on Nebulo's server and are overlaid onto live/history responses using the upstream message ID.
- Original native image content survives subsequent upstream text transformations and server history reloads; message edits still take precedence. Deleted messages do not regain attachments through the overlay.
- Native image references must exist before send, and at most four images are accepted. URL validation rejects script/data URLs and unrelated local endpoints.
- A moderation-provider HTTP failure leaves an upload pending instead of deleting it as though its content was rejected. Nebulo's own content checks remain enabled; this does not alter TLK's filters for content hosted on TLK.

Tests: `node --test scripts/chatNativeAttachments.test.mjs` (four passing tests, including real store persistence/reload in an isolated in-memory filesystem). Route syntax checks pass. No live message was sent and no live database was modified during testing. Source changes require deployment and app restart. Already-deleted image binaries cannot be recovered by this change; affected images need re-uploading.
