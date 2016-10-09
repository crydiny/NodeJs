#include "Utility.h"
#include "cocos2d.h"
USING_NS_CC;
//创建动画

Animation* Utility::createAnimation(std::string  animationName ,int start , int end ,double delayTime )
{
	CCASSERT( animationName != "" , "wrong string , the string must not null" );
	CCASSERT(start < end , "wrong index" );
	std::string::size_type index = animationName.find("%");
	CCASSERT( index != -1 /*std:;string::npos*/ ,"wrong string ");

	char * pChar = const_cast<char*> ( animationName.c_str() );
	Vector<SpriteFrame*> allframe;
	for(int i = start ; i <= end ; ++i){
		SpriteFrame* sf =  SpriteFrameCache::getInstance()->getSpriteFrameByName(StringUtils::format(pChar,i));
		allframe.pushBack(sf);
	}
	Animation* animation = Animation::createWithSpriteFrames(allframe );
	if(delayTime == 0)
		delayTime = 0.3;
	animation->setDelayPerUnit(delayTime);
	return animation;
}

Animation* Utility::createAnimation(std::string  animationName , int num , double delayTime)
{
	return Utility::createAnimation(animationName ,1 , num , delayTime );
}

//创建动作
Animate* Utility::createAnimate(std::string animationName , int num , double delayTime )
{
	return createAnimate(  animationName ,  1 ,  num , delayTime);
}

Animate* Utility::createAnimate(std::string  animationName , int start , int end ,double delayTime){

	CCASSERT( animationName != "" , "wrong string , the string must not null" );
	CCASSERT(start <= end , "wrong index" );
	std::string::size_type index = animationName.find("%");
	CCASSERT( index != -1 /*std:;string::npos*/ ,"wrong string ");

	char * pChar = const_cast<char*> ( animationName.c_str() );
	Vector<SpriteFrame*> allframe;
	for(int i = start ; i <= end ; ++i){
		SpriteFrame* sf =  SpriteFrameCache::getInstance()->getSpriteFrameByName(StringUtils::format(pChar,i));
		allframe.pushBack(sf);
	}
	Animation* animation = Animation::createWithSpriteFrames(allframe );
	if(delayTime <= 0)
		delayTime = 0.3;
	animation->setDelayPerUnit(delayTime);

	return Animate::create(animation);
}

void Utility::setBetweenRangeWidth(Node* node ,Vec2 vec /* = Vec2::ZERO */){
	CCASSERT(node != nullptr , "node == nullptr" );
	auto nodeSize = node->getContentSize();


	auto halfWidth = nodeSize.width /2;
	//左边
	if( node->getPositionX() < ( vec.x + halfWidth ) ){
		node->setPositionX(vec.x + halfWidth);
	//	CCLOG("设置左边位置 %f",node->getPositionX());
	}
	//右边
	if (node->getPositionX() > (vec.y - halfWidth)){
		node->setPositionX(vec.y - halfWidth );
		//CCLOG("设置右边位置 %f",node->getPositionX());

	}

}

void Utility::setBetweenRangeHeight(Node* node ,Vec2 vec /*= Vec2::ZERO*/){
	CCASSERT(node != nullptr , "node == nullptr" );
	Size nodeSize = node->getContentSize();
	auto halfHeight = nodeSize.height /2;
	//下边
	if(node->getPositionY() < (vec.x + halfHeight) ){
		node->setPositionY(vec.x + halfHeight);
	}
	//上边
	if(node->getPositionY() > ( vec.y - halfHeight) ){
		node->setPositionY(vec.y -  halfHeight);
	}
}

bool Utility::isOutOfRangeWith(Node* node ,Vec2 vec /*= Vec2::ZERO*/){
	CCASSERT(node != nullptr , "node == nullptr" );
	auto nodeSize = node->getContentSize();
	auto halfWidth = nodeSize.width /2;
	//左边
	if(node->getPositionX() - halfWidth < vec.x){
		return true;
	}
	//右边
	if(node->getPositionX() + halfWidth > vec.y){
		return true;
	}

	return false;
}

bool Utility::isOutOfRangeHeight(Node* node ,Vec2 vec /*= Vec2::ZERO*/){
	CCASSERT(node != nullptr , "node == nullptr" );
	auto nodeSize = node->getContentSize();
	auto halfHeight = nodeSize.height /2;
	//下边界
	if(node->getPositionY() - halfHeight < vec.x){
		return true;
	}
	//上边界
	if(node->getPositionY() +halfHeight > vec.y){
		return true;
	}
	return false;
}

bool Utility::isOutOfRect(Node* node ,Vec2 vec /*= Vec2::ZERO*/){
		
	return  isOutOfRangeWith(node , Vec2(0,vec.x ) )|| isOutOfRangeHeight(node , Vec2(0,vec.y) ) ;
}

bool Utility::isOutOfRect(Node* node , cocos2d::Rect rect){
	return isOutOfRangeWith(node , Vec2(rect.getMinX(),rect.getMaxX()) ) || isOutOfRangeHeight(node , Vec2(rect.getMinY() , rect.getMaxY()))  ;
}

//在Win32平台下，将GBK编码转换为UTF-8
std::string Utility::gbk_2_utf8(const std::string text)
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
	//采用Lambda表达式,将string转换成wstring
	std::wstring tes = [=]() {
		setlocale(LC_ALL, "chs");
		const char* _Source = text.c_str();
		size_t _Dsize = text.size() + 1;
		wchar_t *_Dest = new wchar_t[_Dsize];
		wmemset(_Dest, 0, _Dsize);
		mbstowcs(_Dest, _Source, _Dsize);
		std::wstring result = _Dest;
		delete[]_Dest;
		setlocale(LC_ALL, "C");
		return result;
	}();

	int asciSize = WideCharToMultiByte(CP_UTF8, 0, tes.c_str(), tes.size(), NULL, 0, NULL, NULL);
	if (asciSize == ERROR_NO_UNICODE_TRANSLATION || asciSize == 0)
	{
		return std::string();
	}

	char *resultString = new char[asciSize];
	int conveResult = WideCharToMultiByte(CP_UTF8, 0, tes.c_str(), tes.size(), resultString, asciSize, NULL, NULL);
	if (conveResult != asciSize)
	{
		return std::string();
	}
	std::string buffer = "";
	buffer.append(resultString, asciSize);

	delete[] resultString;
	return buffer;

#else
	return text;
#endif

}

//将SpriteFrameCache的addSpriteFramesWithFile进行封装
SpriteFrameCache* Utility::addSpriteFramesWithFile(std::string path)
{
	auto cache = SpriteFrameCache::getInstance();
	cache->addSpriteFramesWithFile(path);
	return cache;
}



Sprite* Utility::createSpriteBySpriteFrame(SpriteFrameCache* cache ,const std::string frameName ,Node* node, 
										   Vec2 position /*= Vec2::ZERO*/  , Vec2 anchor /*= Vec2(0.5,0.5)*/)
{
	CCASSERT(cache != nullptr , " cache == nullptr");
	CCASSERT(frameName != "" , " frameName == ");

	auto sp = Sprite::createWithSpriteFrame( cache->getSpriteFrameByName (frameName));
	if(anchor != Vec2(0.5,0.5)){
		sp->setAnchorPoint(anchor);
	}
	node->addChild(sp);
	sp->setPosition (position);
	return sp;
}

Sprite* Utility::createSpriteBySpriteFrame(std::string frameName ,Node* node, Vec2 position /*= Vec2::ZERO */,Vec2 anchor /*= Vec2(0.5,0.5)*/)
{
	CCASSERT(frameName != "" ,"frame is null");
	SpriteFrameCache* cache = SpriteFrameCache::getInstance();
	return createSpriteBySpriteFrame(cache , frameName , node , position ,anchor);
}


Sprite* Utility::createSpriteBySpriteFrameFile(const std::string framefile ,const std::string frameName ,Node* node,
											   Vec2 position /*= Vec2::ZERO*/, Vec2 anchor/* = Vec2(0.5,0.5)*/ )
{
	CCASSERT(framefile != "" , "framefile is null" );
	CCASSERT(frameName != "" , "frameName == "" " );
	auto cache = SpriteFrameCache::getInstance ();
	cache->addSpriteFramesWithFile (framefile);


	auto sp = Sprite::createWithSpriteFrame ( cache->getSpriteFrameByName (frameName));
	if(anchor != Vec2(0.5,0.5)){
		sp->setAnchorPoint(anchor);
	}
	node->addChild(sp);
	sp->setPosition (position);
	return sp;
}

float Utility::randomRange(float start , float end)
{
	return CCRANDOM_0_1()*( end - start ) + start;
}



