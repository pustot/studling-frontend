import { Card, CardActionArea, Chip, Divider, Grid, Theme, Typography } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function LangHomeCardContainer(props: {
    items: {
        name: string;
        link: string;
        stage: string;
    }[]
}) {
    const { items } = props;
    const navigate = useNavigate();

    return (
        <Grid container spacing={2}>
            {items.map((item, index) => (
                <Grid item p={1} xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card
                        sx={{ width: 240, transition: '0.3s ease-in-out', position: 'relative' }}
                        onClick={() => navigate(item.link)}
                    >
                        <CardActionArea sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'end', // 从底部开始排列内容
                            alignItems: 'center',
                        }}>
                            <Typography gutterBottom variant="h5" component="div" sx={{ m: 1, textAlign: 'center' }}>
                                {item.name}
                            </Typography>
                            <Chip
                                label={item.stage}
                                sx={{
                                    mb: 1,
                                    backgroundColor: item.stage === "Beta" ? '#6002EE' : '#e0e0e0',  // ？色背景显眼，其他为灰色
                                    color: item.stage === "Beta" ? '#fff' : 'rgba(0, 0, 0, 0.87)',  // 白色字体与？色背景配合，黑色字体与灰色背景配合
                                    fontWeight: item.stage === "Beta" ? 'bold' : 'normal'
                                }}
                            />
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}