"use client";

import { useState, useTransition } from "react";
import { saveMarketingReport } from "@/actions/marketing/save-report";

export default function MarketingReportForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const [country, setCountry] = useState("NORTH_AMERICA");

  const [waGroups, setWaGroups] = useState(0);
  const [waPosts, setWaPosts] = useState(0);

  const [tgGroups, setTgGroups] = useState(0);
  const [tgPosts, setTgPosts] = useState(0);

  const [fbGroups, setFbGroups] = useState(0);
  const [fbPosts, setFbPosts] = useState(0);

  const [resourceLogin, setResourceLogin] = useState(0);
  const [accountClean, setAccountClean] = useState(0);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    startTransition(async () => {
      const result = await saveMarketingReport({
        country: country as
          | "NORTH_AMERICA"
          | "EUROPE"
          | "AUSTRALIA",

        whatsappGroupsJoined: waGroups,
        whatsappPostsDone: waPosts,

        telegramGroupsJoined: tgGroups,
        telegramPostsDone: tgPosts,

        facebookGroupsJoined: fbGroups,
        facebookPostsDone: fbPosts,

        resourceLogin,
        accountClean,
      });

      setMessage(result.message);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <select
        value={country}
        onChange={(e) =>
          setCountry(e.target.value)
        }
        className="border p-2"
      >
        <option value="NORTH_AMERICA">
          North America
        </option>

        <option value="EUROPE">
          Europe
        </option>

        <option value="AUSTRALIA">
          Australia
        </option>
      </select>

      <div>
        <h3>WhatsApp</h3>

        <input
          type="number"
          placeholder="Groups Joined"
          value={waGroups}
          onChange={(e) =>
            setWaGroups(Number(e.target.value))
          }
        />

        <input
          type="number"
          placeholder="Posts Done"
          value={waPosts}
          onChange={(e) =>
            setWaPosts(Number(e.target.value))
          }
        />
      </div>

      <div>
        <h3>Telegram</h3>

        <input
          type="number"
          placeholder="Groups Joined"
          value={tgGroups}
          onChange={(e) =>
            setTgGroups(Number(e.target.value))
          }
        />

        <input
          type="number"
          placeholder="Posts Done"
          value={tgPosts}
          onChange={(e) =>
            setTgPosts(Number(e.target.value))
          }
        />
      </div>

      <div>
        <h3>Facebook</h3>

        <input
          type="number"
          placeholder="Groups Joined"
          value={fbGroups}
          onChange={(e) =>
            setFbGroups(Number(e.target.value))
          }
        />

        <input
          type="number"
          placeholder="Posts Done"
          value={fbPosts}
          onChange={(e) =>
            setFbPosts(Number(e.target.value))
          }
        />
      </div>

      <div>
        <h3>Common Metrics</h3>

        <input
          type="number"
          placeholder="Resource Login"
          value={resourceLogin}
          onChange={(e) =>
            setResourceLogin(Number(e.target.value))
          }
        />

        <input
          type="number"
          placeholder="Account Clean"
          value={accountClean}
          onChange={(e) =>
            setAccountClean(Number(e.target.value))
          }
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        {isPending
          ? "Saving..."
          : "Save Report"}
      </button>

      {message && (
        <p>{message}</p>
      )}
    </form>
  );
}