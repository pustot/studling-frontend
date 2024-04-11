import { Button } from "@mui/material";
import * as React from "react";
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();  // 获取navigate函数

    const goBack = () => {
        navigate(-1);  // 导航到上一个访问的页面
    };

    return (
        <Button variant="outlined" onClick={goBack}>
            返回
        </Button>
    );
};

export default BackButton;
