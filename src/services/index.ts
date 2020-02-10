import fetch from "@/utils/fetch";
export async function fetchData({
  url,
  type,
  cityId
}: {
  url: string;
  type: string;
  cityId: number;
}) {
  let data: any;
  if (type !== "get") {
    data = await fetch(url, {
      method: "POST",
      data: JSON.stringify({
        cityId,
        currentUserAlias: "string",
        currentUserName: "string",
        params: [
          {
            key: "string",
            value: {}
          }
        ],
        staffCreated: "string",
        staffModified: "string",
        type: 0
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
  } else {
    data = await fetch(url);
  }
  return data.data;
}

export async function fetchApplication({ id }: { id: string }) {
  const { data } = await fetch(`/alita/app/search?id=${id}`);
  return data;
}

export async function fetchPage({ id }: { id: string }) {
  const { data } = await fetch(`/alita/page/search?id=${id}`);
  return data;
}

export async function updatePage(payload: any) {
  const { data } = await fetch(`/alita/page/update`, {
    method: "POST",
    data: JSON.stringify(payload),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  return data;
}
