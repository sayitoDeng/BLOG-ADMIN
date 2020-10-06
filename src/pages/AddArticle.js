import React,{useState} from 'react';
import '../static/css/AddArticle.css'
import { Row, Col ,Input, Select ,Button ,DatePicker } from 'antd';
import ReactMarkdown from 'react-markdown';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';

const { Option } = Select;
const { TextArea } = Input

export default function AddArticle() {
    const [articleTitle,setArticleTitle] = useState('')   //文章标题
    const [selectedTab,setSelectedTab] = useState("write");//md状态
    const [markdown,setMarkdown] = useState('');//markdown内容
    const [introducemd,setIntroducemd] = useState();//简介的markdown内容
    const [showDate,setShowDate] = useState()   //发布日期
    const [updateDate,setUpdateDate] = useState() //修改日志的日期
    const [typeInfo ,setTypeInfo] = useState([]) // 文章类别信息
    const [selectedType,setSelectType] = useState(1) //选择的文章类别


    return (
        <div>
            <Row gutter={5}>
                <Col span={18}>
                        <Row gutter={10} >
                            <Col span={20}>
                                <Input 
                                    placeholder="博客标题" 
                                    size="large" />
                            </Col>
                            <Col span={4}>
                                &nbsp;
                                <Select defaultValue="Sign Up" size="large">
                                    <Option value="Sign Up">daily</Option>
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
                                <Button type="primary" size="large" onClick>发布文章</Button>
                                <br/>
                        </Col>
                        <Col span={24}>
                            <br/>
                            <TextArea 
                                rows={4} 
                                placeholder="文章简介"
                            />
                            <br/><br/>
                            <div  className="introduce-html"></div>
                        </Col>
                        <Col span={12}>
                            <div className="date-select">
                                <DatePicker
                                    placeholder="发布日期"
                                    size="large"  
                                />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            </div>
    )
}
