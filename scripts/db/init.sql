-- Game Project Database Initialization Script
-- Run when PostgreSQL container starts for the first time

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 设置搜索路径
SET search_path TO public;

-- 创建表空间（如果需要）
-- CREATE TABLESPACE game_data LOCATION '/var/lib/postgresql/data';

-- 创建用户特定配置（如果需要）
-- 注意：这里只是示例，实际生产环境需要更严格的配置

-- 设置默认权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO game_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO game_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO game_user;

-- 创建初始数据（如果需要）
-- INSERT INTO ...

-- 记录初始化完成
COMMENT ON DATABASE game_db IS 'Game Project Database - Initialized';

-- 输出完成信息
DO $$
BEGIN
    RAISE NOTICE '✅ Database initialization completed successfully';
    RAISE NOTICE '   Database: game_db';
    RAISE NOTICE '   User: game_user';
    RAISE NOTICE '   Time: %', CURRENT_TIMESTAMP;
END $$;