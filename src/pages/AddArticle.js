import React,{useState,useEffect} from 'react';
import '../static/css/AddArticle.css'
import { Row, Col ,Input, Select ,Button ,DatePicker,message } from 'antd';
import ReactMarkdown from 'react-markdown';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import axios from 'axios';
import  servicePath  from '../config/apiUrl';

const { Option } = Select;
const { TextArea } = Input

export default function AddArticle(props) {
    const [articleId,setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
    const [articleTitle,setArticleTitle] = useState('')   //文章标题
    const [selectedTab,setSelectedTab] = useState("write");//md状态
    const [markdown,setMarkdown] = useState('');//markdown内容
    const [introducemd,setIntroducemd] = useState();//简介的markdown内容
    const [showDate,setShowDate] = useState()   //发布日期
    const [updateDate,setUpdateDate] = useState() //修改日志的日期
    const [typeInfo ,setTypeInfo] = useState([]) // 文章类别信息
    const [selectedType,setSelectType] = useState(1) //选择的文章类别

    //从中台得到文章类别信息
    const getTypeInfo =()=>{

        axios({
            method:'get',
            url:servicePath.getTypeInfo,
            header:{ 'Access-Control-Allow-Origin':'*' },
            withCredentials: true
        }).then(
        res=>{
            if(res.data.data==="没有登录"){
                localStorage.removeItem('openId')
                props.history.push('/login')  
            }else{
                setTypeInfo(res.data.data)
            }

            }
        )
    }
    useEffect(()=>{
        getTypeInfo();
        //获得文章ID
        let tmpId = props.match.params.id
        if(tmpId){
            setArticleId(tmpId)
            getArticleById(tmpId)
        }  
    },[]);
    const getArticleById = (id)=>{
        axios(servicePath.getArticleById+id,{ 
            withCredentials: true,
            header:{ 'Access-Control-Allow-Origin':'*' }
        }).then(
            res=>{console.log(res)
                //let articleInfo= res.data.data[0]
                setArticleTitle(res.data.data[0].title)
                setMarkdown(res.data.data[0].article_content)
                setIntroducemd(res.data.data[0].introduce)
                // let tmpInt = marked(res.data.data[0].introduce)
                // setIntroducehtml(tmpInt)
                setShowDate(res.data.data[0].addTime)
                setSelectType(res.data.data[0].typeId)
    
            }
        )
    }
    //选择类别后的便哈
    const selectTypeHandler =(value)=>{
        setSelectType(value)
    }
    //保存文章
    const saveArticle = ()=>{
        if(!selectedType){
            message.error('必须选择文章类别')
            return false
        }else if(!articleTitle){
            message.error('文章名称不能为空')
            return false
        }else if(!markdown){
            message.error('文章内容不能为空')
            return false
        }else if(!introducemd){
            message.error('简介不能为空')
            return false
        }else if(!showDate){
            message.error('发布日期不能为空')
            return false
        }
        let dataProps={}   //传递到接口的参数
        dataProps.type_id = selectedType 
        dataProps.title = articleTitle
        dataProps.article_content =markdown
        dataProps.introduce =introducemd
        let datetext= showDate.replace('-','/') //把字符串转换成时间戳
        dataProps.addTime =(new Date(datetext).getTime())/1000

        if(articleId==0){
            console.log('articleId=:'+articleId)
            dataProps.view_count =Math.ceil(Math.random()*100)+1000
            axios({
                method:'post',
                url:servicePath.addArticle,
                data:dataProps,
                withCredentials: true
            }).then(
                res=>{
                    setArticleId(res.data.insertId)
                    if(res.data.isScuccess){
                        message.success('文章保存成功')
                    }else{
                        message.error('文章保存失败');
                    }
    
                }
            )
        }else{
            dataProps.id = articleId 
            axios({
                method:'post',
                url:servicePath.updateArticle,
                header:{ 'Access-Control-Allow-Origin':'*' },
                data:dataProps,
                withCredentials: true
            }).then(
               res=>{

                if(res.data.isScuccess){
                    message.success('文章保存成功')
                }else{
                    message.error('保存失败');
                }


               }
            )
        }

    }
    return (
        <div>
            <Row gutter={5}>
                <Col span={18}>
                        <Row gutter={10} >
                            <Col span={20}>
                                <Input 
                                    placeholder="博客标题" 
                                    size="large" 
                                    value={articleTitle}
                                    onChange={e=>{
                                        setArticleTitle(e.target.value)
                                    }}
                                />
                            </Col>
                            <Col span={4}>
                                &nbsp;
                                <Select defaultValue={selectedType} size="large" onChange={selectTypeHandler} value={selectedType}>
                                    {
                                        typeInfo.map((item,index)=>{
                                            return (<Option key={index} value={item.Id}>{item.typeName}</Option>)
                                        })
                                    }
                                </Select>
                            </Col>
                        </Row>
                        <br/>
                        <Row gutter={30} >
                            {/* <Col span={12}>
                                <TextArea 
                                    className="markdown-content" 
                                    rows={35}  
                                    placeholder="文章内容"
                                    />
                            </Col>
                            <Col span={12}>
                                <div 
                                    className="show-html">

                                </div>

                            </Col> */}
                            <Col span={24}>
                                <div className="contentbox" >
                                    
                                    <ReactMde
                                        selectedTab={selectedTab}
                                        onTabChange={(tab)=>setSelectedTab(tab)}
                                        onChange={md=>setMarkdown(md)}

                                        l18n={{"write":"编辑","preview":"预览"}}
                                        value={markdown}

                                        minEditorHeight={"600"}
                                        generateMarkdownPreview={(markdown) => 
                                            Promise.resolve(<ReactMarkdown source={markdown} />)}
                                        />
                                    
                                </div>
                            </Col>                           
                        </Row>  

                </Col>

                <Col span={6}>
                    <Row>
                        <Col span={24}>
                                <Button  size="large">暂存文章</Button>&nbsp;
                                <Button type="primary" size="large" onClick={saveArticle}>发布文章</Button>
                                <br/>
                        </Col>
                        <Col span={24}>
                            <br/>
                            <TextArea 
                                rows={4} 
                                placeholder="文章简介"
                                onChange={e=>{
                                    setIntroducemd(e.target.value)
                                }}
                                value={introducemd}
                            />
                            <br/><br/>
                            <div  className="introduce-html"></div>
                        </Col>
                        <Col span={12}>
                            <div className="date-select">
                                <DatePicker
                                    placeholder="发布日期"
                                    size="large"  
                                    onChange={(date,dateString)=>setShowDate(dateString)} 
                                  //  value={showDate}
                                />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            </div>
    )
}
