
import { useState } from "react";

import { useCreateAdminInvite } from "../api/admin-invite";

import type { AdminInvite } from "../api/admin-invite";

type InviteRow = AdminInvite & { url: string };

const AdminInvitePage = () => {
  const createInvite = useCreateAdminInvite();
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const onCreate = () =>
    createInvite.mutate(undefined, {
      onSuccess: (invite) => {
        setInvites((prev) => [
          { ...invite, url: `${window.location.origin}/invite/${invite.token}` },
          ...prev,
        ]);
      },
    });

  const onCopy = async (invite: InviteRow) => {
    await navigator.clipboard.writeText(invite.url);
    setCopiedToken(invite.token);
  };

  return (
    <>
      <div className="row-between">
        <h1>관리자 초대</h1>
        <button
          type="button"
          className="button"
          onClick={onCreate}
          disabled={createInvite.isPending}
        >
          초대 링크 생성
        </button>
      </div>
      <p className="muted">링크를 복사해 전달한다. 메일 발송은 없다.</p>
      {createInvite.isError && <p className="error-text">{createInvite.error.message}</p>}
      {invites.length === 0 ? (
        <p className="muted">생성된 링크가 없다.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>링크</th>
              <th>만료</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {invites.map((invite) => (
              <tr key={invite.token}>
                <td>
                  <span className="mono-box">{invite.url}</span>
                </td>
                <td>{new Date(invite.expiresAt).toLocaleString("ko-KR")}</td>
                <td>
                  <button
                    type="button"
                    className="button button-secondary button-sm"
                    onClick={() => onCopy(invite)}
                  >
                    {copiedToken === invite.token ? "복사됨" : "복사"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default AdminInvitePage;
