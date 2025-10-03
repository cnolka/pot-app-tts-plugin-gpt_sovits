"""
生成 pot-app 插件文件的简单脚本
"""

import json
import zipfile
import os
import sys

def create_potext():
    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 定义文件路径
    info_path = os.path.join(script_dir, 'info.json')
    main_js_path = os.path.join(script_dir, 'main.js')
    
    # 读取 info.json
    try:
        with open(info_path, 'r', encoding='utf-8') as f:
            info_data = json.load(f)
    except FileNotFoundError:
        print(f"错误: 找不到 info.json 文件")
        print(f"搜索路径: {info_path}")
        return False
    
    # 获取插件 ID 和图标文件名
    plugin_id = info_data['id']
    icon_file = info_data['icon']
    icon_path = os.path.join(script_dir, icon_file)
    
    # 创建 .potext 文件
    potext_file = os.path.join(script_dir, f"{plugin_id}.potext")
    
    # 检查所有必需文件是否存在
    required_files = [
        ('info.json', info_path),
        ('main.js', main_js_path),
        (icon_file, icon_path)
    ]
    
    for file_name, file_path in required_files:
        if not os.path.exists(file_path):
            print(f"错误: 文件不存在: {file_name}")
            print(f"搜索路径: {file_path}")
            return False
    
    # 创建 ZIP 文件
    try:
        with zipfile.ZipFile(potext_file, 'w') as zipf:
            zipf.write(info_path, 'info.json')
            zipf.write(main_js_path, 'main.js')
            zipf.write(icon_path, icon_file)
        
        print(f"成功创建插件文件: {potext_file}")
        return True
    except Exception as e:
        print(f"创建插件文件时出错: {e}")
        return False

if __name__ == "__main__":
    create_potext()