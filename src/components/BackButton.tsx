import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'; // 导入返回箭头图标
import IconButton from '@mui/material/IconButton';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();  // 获取navigate函数

    const goBack = () => {
        navigate(-1);  // 导航到上一个访问的页面
    };

    return (
        <IconButton
            onClick={goBack}
            aria-label="返回"
            color='primary'
            size="small"  // 设置IconButton为小尺寸
            sx={{
                // 进一步调整图标大小和样式
                fontSize: '1rem'  // 调整图标字体大小
            }}
        >
            <ArrowBackIosNewIcon fontSize="small" />返回
        </IconButton>
    );
};

export default BackButton;
