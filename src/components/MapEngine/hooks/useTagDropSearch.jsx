/* eslint-disable no-undef */
import React, { useEffect, useState, useMemo } from "react";
/* eslint-disable no-param-reassign */
/**
 * 下拉搜索框，支持多选
 * **/
import { fetch, json } from "@didi/fate-common";

import { Select, Spin } from "antd";

export default function useTagDropSearch(props) {
  const {
    url,
    params,
    filters,
    placeholder = "搜索",
    onChange,
    style = {
      minWidth: "80px"
    }
  } = props;
  const [resultList, setResultList] = useState([]);
  let [query, setQuery] = useState("");
  let [loading, setLoading] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const execQuery = useCallback(word => {
    let tmpQuery = word.replace(/\s/g, "");
    let tmpFilters = [
      {
        key: "name",
        value: tmpQuery
      }
    ];
    tmpFilters = tmpFilters.concat(filters);
    let validFilters = tmpFilters.filter(filter => filter.value);
    if (validFilters.length == 0) {
      setResultList([]);
    } else {
      const tmpParams = {
        ...params,
        params: validFilters
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
  });
  useEffect(() => {
    execQuery(query);
  }, [execQuery, query]);
  let options = useMemo(() => {
    return resultList.length
      ? resultList.map((d, index) => (
          <Select.Option key={`${d.id}-${index}`} value={d.id ? d.id : d.name}>
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
      mode="multiple"
      showArrow={false}
      size="small"
      placeholder={placeholder}
      onSearch={e => {
        setQuery(e);
      }}
      onFocus={() => execQuery("")}
      filterOption={false}
      onChange={name => {
        const result = resultList.find(item => item.name === name);
        onChange && onChange(result);
      }}
    >
      {" "}
      {options}{" "}
    </Select>
  );
}
