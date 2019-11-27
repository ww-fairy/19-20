```html
      <fieldset>
         <legend>Title</legend>
         <ul>
            <li><input type="radio" id="man" value="1" name="title">
               <label for="man">man</label></li>
            <li> <input type="radio" id="woman" value="2" name="title">
               <label for="woman">woman</label></li>
         </ul>
      </fieldset>
```

```html
      <fieldset>
         <legend>Title</legend>
         <ul>
            <li><input type="radio" id="man" value="1" >
               <label for="man">man</label></li>
            <li> <input type="radio" id="woman" value="2">
               <label for="woman">woman</label></li>
         </ul>
      </fieldset>

```

`name`决定组，同一个`name`下确定了按钮按下的互斥和抬起

`id`帮`label` 进行绑定

`name` 属性，表单提交的属性

name 属性规定 <input> 元素的名称。

name 属性用于在 JavaScript 中引用元素，或者在表单提交后引用表单数据。

**注意：**只有设置了 name 属性的表单元素才能在提交表单时传递它们的值。