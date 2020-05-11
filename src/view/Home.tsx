import React, { useEffect, useState } from 'react'
import {  Divider, Button } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import style from './style.less'
import { getData } from '../api/api'
import QRCode from 'qrcode.react'
import { ControlOutlined, AppleFilled, AndroidFilled } from '@ant-design/icons'
import { parseQueryString } from '../libs/until'
const Home = () => {
  const currUrl = location.href
  const query = parseQueryString(currUrl)
  const [latest, setLatest] = useState({
    app_name: '',
    app_version: '',
    app_build: '',
    app_size: '',
    oss_url: '',
    created_time: '',
    version_type: '',
    update_description: '',
  })
  const [list, setList] = useState([])
  const getAppInfo = (model: any, id: any) => {
    getData({
      page: 1,
      page_size: 10,
      version_type: model,
      project_id: id,
    }).then((res) => {
      console.log(res.data)
      setLatest(res.data.items[0])
      setList(res.data.items)
    })
  }
  const handleSwitchVersion = (index: any) => {
    setLatest(list[index])
  }
  useEffect(() => {
    let ua = navigator.userAgent
    console.log(ua)
    if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      getAppInfo('ios', query.id)
    } else {
      getAppInfo('android', query.id)
    }
  }, [])
  return (
    <div className={style.wrapper}>
      <div className={style['icon-box']}>
        <img src={require('../assets/img/asoco-logo-max.jpg')} />
      </div>
      <Link to={{ pathname: `/app/manage` }}>
        <Button
          className={style['manage-link-btn']}
          type="primary"
          shape="round"
          icon={<ControlOutlined style={{ paddingRight: 5 }} />}
          ghost={true}
        >
          管理页面
        </Button>
      </Link>

      <section className={style['desc']}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {latest.version_type === 'ios' ? (
            <AppleFilled style={{ fontSize: 25 }} />
          ) : (
            <AndroidFilled style={{ fontSize: 25 }} />
          )}
          <span className={style['app-name']}>{latest.app_name}</span>
          <span className={style['app-tag']}>内测版</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <span className={style['sub-title']}>
            版本：{latest.app_version}（build {latest.app_build}）
          </span>
          <span className={style['sub-title']}>大小：{latest.app_size} MB</span>
          <span className={style['sub-title']}>
            更新时间：{latest.created_time}
          </span>
        </div>
        <div className={style['download']}>
          <div className={style['qrcode']}>
            <QRCode value={currUrl}></QRCode>
          </div>
          <a href={latest.oss_url} className={style['downlaod-btn']}>
            点击安装
          </a>
        </div>
      </section>
      <Divider />
      <section>
        <p className={style['title']}>更新说明</p>
        <span className={style['content']}>
          {latest.update_description || '暂无'}
        </span>
      </section>
      <Divider />
      <section>
        <p className={style['title']}>历史版本</p>
        <div className={style['list']}>
          {list
            ? list.map((e, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      handleSwitchVersion(index)
                    }}
                  >
                    <span>
                      {e.app_version}（build {e.app_build}）
                    </span>
                    <span>{e.update_description || '暂无'}</span>
                    <span>{e.created_time}</span>
                  </div>
                )
              })
            : ''}
        </div>
      </section>
    </div>
  )
}
export default Home
