import { useEffect, useState } from 'react'
import { Card, Grid } from 'antd-mobile'
import { history } from 'umi';
import { EyeOutline, ScanCodeOutline, TravelOutline } from 'antd-mobile-icons';

import styles from './index.less'
const Home = () => {
  const [menus, setMenus] = useState<any>([])
  useEffect(() => {
    setMenus([
      {module: "质检", items:[{name:'质检', path: "/sign", icon: <EyeOutline style={{color: "#ff4800"}}/>}]},
      {module: "分拣", items:[{name: '分拣', path: "/pick", icon: <ScanCodeOutline style={{color: "#1677ff"}} />}]},
      {module: "出库", items:[{name: '打包', path: "/printPackage", icon: <TravelOutline style={{color: "green"}} /> }]},
    ])
  },[])
  return <div className={styles.home}>
    {
      menus.map(item => {
        return (
          <Card className={styles.card}>
            <Grid gap={8} columns={4}>
            {
            item.items.map(item => {
              return <Grid.Item key={item.name} onClick={() => history.push(item.path)}>
                <div className={styles.menuItem}>
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </Grid.Item>
            })
          }
        </Grid>
          </Card>
        )
      })
    }
  </div>
}

export default Home