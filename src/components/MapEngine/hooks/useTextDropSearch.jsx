import React, { useEffect, useState, useMemo } from "react";
/* eslint-disable no-param-reassign */
import { Select, Spin } from "antd";

export default function useDropSearch(props) {
  const {
    url,
    params,
    placeholder = "搜索",
    onChange,
    style = {
      minWidth: "80px"
    }
  } = props;
  const [resultList, setResultList] = useState([]);
  let [query, setQuery] = useState("");
  let [loading, setLoading] = useState(false);
  useEffect(() => {
    let tmpQuery = query.replace(/\s/g, "");
    if (!tmpQuery) {
      setResultList([]);
    } else {
      const tmpParams = {
        ...params,
        params: [
          {
            key: "name",
            value: tmpQuery
          }
        ]
      };
      setLoading(true);
      fetch(url, {
        method: "POST",
        data: JSON.stringify(tmpParams),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(result => {
          const { data } = result;
          const { payload = {} } = data;
          setResultList(payload);
        })
        .catch(exp => {
          setResultList([]);
        })
        .finally(setLoading(false));
    }
  }, [params, query, url]);
  let options = useMemo(() => {
    return resultList.length
      ? resultList.map((d, index) => (
          <Select.Option key={`${d.id}-${index}`} value={d.name}>
            {" "}
            {d.name}{" "}
          </Select.Option>
        ))
      : null;
  }, [resultList]);
  return (
    <Select
      style={style}
      showSearch
      notFoundContent={loading ? <Spin size="small" /> : null}
      allowClear
      showArrow={false}
      size="small"
      placeholder={placeholder}
      onSearch={e => {
        setQuery(e);
      }}
      filterOption={false}
      onChange={name => {
        const result = resultList.find(item => item.name === name);
        onChange && onChange(result);
      }}
    >
      {options}{" "}
    </Select>
  );
}
